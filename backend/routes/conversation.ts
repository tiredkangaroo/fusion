import { Loaded } from "@mikro-orm/core";
import { Request, Router } from "express";
import { DI } from "..";
import Conversation from "../entities/Conversation";
import User from "../entities/User";
import Validate from "../inputvalidator";
import { loginCheck } from "./auth";

const conversationRouter = Router();

export async function modifyConversation(
  req: Request
): Promise<
  | { errors: Array<string> }
  | { user: Loaded<User>; conversation: Loaded<Conversation>; errors: null }
> {
  //validate conversation_id
  const { user, error } = await loginCheck(req);
  if (error || !user) {
    return { errors: [error] };
  }
  const check = Validate("modifyConversationInput", req.body);
  if (check.errors) {
    return { errors: check.errors };
  }
  const conversation = await DI.em.findOne(Conversation, {
    _id: req.params.conversation_id || req.body.conversation_id,
  });
  if (!conversation) {
    return { errors: [`Conversation does not exist.`] };
  }
  if (!conversation.members.contains(user)) {
    return { errors: ["This user is unauthorized to perform this action."] };
  }
  return { user: user, conversation: conversation, errors: null };
}
conversationRouter.get("/myconversations", async (req, res) => {
  const { user, error } = await loginCheck(req);
  if (error || !user) {
    return res.status(401).json({ errors: [error] });
  }
  return res.status(200).json({ errors: null, data: user.conversations });
});

conversationRouter.post("/startconversation", async (req, res) => {
  const { user, error } = await loginCheck(req);
  if (error || !user) {
    return res.status(401).json({ errors: [error] });
  }
  const check = Validate("startConversationInput", req.body);
  if (check.errors) {
    return res.status(400).json(check);
  }
  const members = req.body.members.split(",");
  let membersAsUsers = [];
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
  const modifiers = await modifyConversation(req);
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
  return res.status(200).json({ errors: null });
});

conversationRouter.post("/removemember", async (req, res) => {
  const modifiers = await modifyConversation(req);
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
  const modifiers = await modifyConversation(req);
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
export default conversationRouter;
