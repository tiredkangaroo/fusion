import { EntityData } from "@mikro-orm/core";
import { Router } from "express";
import { RI, DI, WSSI, CI } from "..";
import Conversation from "../entities/Conversation";
import User from "../entities/User";
import Validate from "../inputvalidator";
import { newMessage } from "./message";
import { WebSocket } from "ws";
const conversationRouter = Router();

export async function modifyConversation(
  user: EntityData<User>,
  conversation_id: string,
): Promise<
  | { errors: Array<string> }
  | {
      user: EntityData<User>;
      conversation: Conversation;
      errors: null;
    }
> {
  const conversation = await DI.em.findOne(
    Conversation,
    {
      _id: conversation_id,
    },
    {
      populate: ["members", "members._id", "members.username", "members.email"],
    },
  );
  if (!conversation) {
    return { errors: [`Conversation does not exist.`] };
  }
  if (!conversation.members.contains(user as User)) {
    return { errors: ["This user is unauthorized to perform this action."] };
  }
  return { user: user, conversation: conversation, errors: null };
}
conversationRouter.get("/myconversations", async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ errors: "User is not logged in." });
  }
  return res.status(200).json({ errors: null, data: user.conversations });
});

conversationRouter.post("/startconversation", async (req, res) => {
  const user = req.user as User;
  if (!user) {
    return res.status(401).json({ errors: "User is not logged in." });
  }
  const check = Validate("startConversationInput", req.body);
  if (check.errors) {
    return res.status(400).json(check);
  }
  const members = req.body.members.split(",");
  const membersAsUsers = [];
  for (let i = 0; i < members.length; i++) {
    const memberAsUser = await DI.em.findOne(User, {
      username: members[i],
    });
    if (!memberAsUser) {
      return res
        .status(404)
        .json({ errors: [`User ${members[i]} does NOT EXIST.`] });
    }
    membersAsUsers.push(memberAsUser);
  }
  const newConversation = await DI.em.create(Conversation, {});
  newConversation.members.add(user);
  for (let i = 0; i < membersAsUsers.length; i++) {
    newConversation.members.add(membersAsUsers[i]);
  }
  try {
    DI.em.persistAndFlush(newConversation);
  } catch (err) {
    return res.status(500).json({ errors: [err] });
  }
  return res.status(200).json({
    errors: null,
  });
});

conversationRouter.post("/addmember", async (req, res) => {
  if (!req.user) {
    return res.status(401).send("You must be logged in.");
  }
  const modifiers = await modifyConversation(
    req.user,
    req.body.conversation_id,
  );
  if (modifiers.errors || !modifiers.conversation) {
    return res.status(400).json({ errors: modifiers.errors });
  }
  const { conversation } = modifiers;
  const userToAdd = await DI.em.findOne(User, {
    username: req.body.username,
  });
  if (!userToAdd) {
    return res.status(404).json({ errors: ["That user does not exist. "] });
  }
  conversation.members.add(userToAdd);
  try {
    DI.em.persistAndFlush(conversation);
  } catch (err) {
    return res.status(500).json({ errors: [err] });
  }
  return res.status(200).json({ errors: null, data: userToAdd });
});

conversationRouter.post("/removemember", async (req, res) => {
  if (!req.user) {
    return res.status(401).send("You must be logged in.");
  }
  const modifiers = await modifyConversation(
    req.user,
    req.body.conversation_id,
  );
  if (modifiers.errors || !modifiers.conversation) {
    return res.status(400).json({ errors: modifiers.errors });
  }
  const { conversation } = modifiers;
  const userToRemove = await DI.em.findOne(User, {
    username: req.body.username,
  });
  if (!userToRemove) {
    return res.status(404).json({ errors: ["That user does not exist."] });
  }
  if (conversation.members.length === 2) {
    return res.status(400).json({
      errors: [
        "A conversation must have at least two people. Conversation was not modified.",
      ],
    });
  }
  conversation.members.remove(userToRemove);
  try {
    DI.em.persistAndFlush(conversation);
  } catch (err) {
    return res.status(500).json({ errors: [err] });
  }
  return res.status(200).json({ errors: null });
});

conversationRouter.post("/setTitle", async (req, res) => {
  if (!req.user) {
    return res.status(401).send("You are not logged in.");
  }
  const modifiers = await modifyConversation(
    req.user,
    req.body.conversation_id,
  );
  if (modifiers.errors || !modifiers.conversation) {
    return res.status(401).json({ errors: modifiers.errors });
  }
  const { conversation } = modifiers;
  const check = Validate("setTitleInput", req.body);
  if (check.errors) {
    return res.status(400).json(check);
  }
  const title = req.body.title;
  if (title.length > 0) {
    conversation.title = title;
  } else {
    conversation.title = null;
  }
  try {
    DI.em.persistAndFlush(conversation);
  } catch (err) {
    return res.status(500).json({ errors: [err] });
  }
  return res.status(200).json({ errors: null });
});
// conversationRouter.ws("/activeConversation", async (ws, req) => {
//   ws.on("message", async (msg) => {
//     const [conversation_id, action, data] = msg.toString("utf8").split("*##*");
//     const { user, error } = await loginCheck(req);
//     if (error) {
//       ws.send("ERROR: you must be logged in to access live conversation");
//       ws.close();
//     }
//     if (action === "sendMessage") {
//     }
//   });
// });
async function broadcastMessage(
  user: EntityData<User> | null,
  conversation_id: string,
  message: string | ArrayBuffer | unknown,
) {
  if (!user) {
    return 1;
  }
  await newMessage(user, message as string, conversation_id);
  if (CI.has(conversation_id)) {
    CI.get(conversation_id).forEach((client: WebSocket) => {
      if (client.readyState === client.OPEN) {
        if (typeof message === "string" || message instanceof ArrayBuffer) {
          client.send(JSON.stringify({ user: user, message: message }));
        } else {
          console.log(
            "Will not be sending message to ANY clients. Message is of incompatible type.",
          );
        }
      }
    });
  }
  return 0;
}
async function getUser(rawCookies: string) {
  const cookies = rawCookies.split(";");
  let session_token;
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [name, value] = cookie.split("=");
    if (name === "session") {
      session_token = value;
      break;
    }
  }
  const user_id = await RI.get(session_token as string);
  if (!user_id) {
    console.log("here i failed 223");
    return null;
  }
  return await DI.em.findOne(User, {
    _id: user_id,
  });
}
WSSI.on("connection", async (ws, req) => {
  if (!req.headers.cookie) {
    ws.send("[ERROR]: Unable to recieve cookies.");
    return ws.close();
  }
  const user = await getUser(req.headers.cookie);
  // const user = await getUser(req.headers.cookies as string);
  const conversation_id = req.url?.split("/").pop();
  if (!conversation_id) {
    ws.send("You must provide a conversation_id.");
    return ws.close();
  }
  if (!CI.has(conversation_id)) {
    CI.set(conversation_id, new Set());
  }
  CI.get(conversation_id).add(ws);
  console.log(`A client just connected to ${conversation_id}.`);
  ws.on("message", async (msg) => {
    await broadcastMessage(user, conversation_id, msg);
    // console.log(
    // `i sent the message: ${msg} as ${user?.username} to ${conversation_id}`,
    // );
  });
  ws.on("close", () => {
    return CI.get(conversation_id).delete(ws);
  });
});
export default conversationRouter;
