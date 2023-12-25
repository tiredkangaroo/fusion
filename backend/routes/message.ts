import { Router } from "express";
import { DI } from "..";
import Conversation from "../entities/Conversation";
import Message from "../entities/Message";
import User from "../entities/User";
import { modifyConversation } from "./conversation";
import { EntityData } from "@mikro-orm/core";

const messageRouter = Router();

export async function newMessage(
  user: EntityData<User>,
  text: string,
  conversation_id: string,
) {
  const conversation = await DI.em.findOne(Conversation, {
    _id: conversation_id,
  });
  if (!conversation) {
    return {
      data: null,
      errors: ["There is no conversation with the associated id."],
    };
  }
  const newMessage = DI.em.create(Message, {
    conversation: conversation,
    text: text,
    user: user,
  });
  // if (req.body.image){
  // 	newMessage.image = ""
  // }
  await DI.em.persistAndFlush(newMessage);
  const populatedNewMessage = await DI.em.findOne(
    Message,
    {
      _id: newMessage._id,
    },
    {
      populate: ["user._id", "user.email", "user.pfp", "user.username"],
    },
  );
  return {
    data: populatedNewMessage,
    errors: null,
  };
}
messageRouter.post("/newmessage", async (req, res) => {
  const { data, errors } = await newMessage(
    req.user!,
    req.body.text,
    req.body.conversation_id,
  );
  if (errors) {
    return res.status(400).send({ data: null, errors: errors });
  }
  return res.status(200).json({ errors: null, data: data!._id });
});

messageRouter.get("/getMessages/:conversation_id", async (req, res) => {
  const modifiers = await modifyConversation(
    req.user as User,
    req.params.conversation_id,
  );
  if (modifiers.errors || !modifiers.conversation) {
    return res.status(401).send(modifiers);
  }
  const messages = await DI.em.find(
    Message,
    {
      conversation: modifiers.conversation,
    },
    { populate: ["user", "user.username", "user.email", "user.pfp"] },
  );
  return res.status(200).json({ errors: null, data: messages });
});
export default messageRouter;
