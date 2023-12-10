import { Router } from "express";
import { DI } from "..";
import Conversation from "../entities/Conversation";
import Message from "../entities/Message";
import Validate from "../inputvalidator";
import { loginCheck } from "./auth";
import { modifyConversation } from "./conversation";

const messageRouter = Router();

messageRouter.post("/newmessage", async (req, res) => {
  const { user, error } = await loginCheck(req);
  if (error || !user) {
    return res.status(401).send({ errors: [error] });
  }
  const check = Validate("newMessageInput", req.body);
  if (check.errors) {
    return res.status(400).json(check);
  }
  const conversation = await DI.em.findOne(Conversation, {
    _id: req.body.conversation_id,
  });
  if (!conversation) {
    return res
      .status(404)
      .json({ errors: ["There is no conversation with the associated id."] });
  }
  const newMessage = DI.em.create(Message, {
    conversation: conversation,
    text: req.body.text,
    user: user,
  });
  if (req.body.text) {
    newMessage.text = req.body.text;
  }
  // if (req.body.image){
  // 	newMessage.image = ""
  // }
  DI.em.persistAndFlush(newMessage);
  return res.status(200).json({ errors: null, data: newMessage._id });
});

messageRouter.get("/getMessages/:conversation_id", async (req, res) => {
  const modifiers = await modifyConversation(req);
  if (modifiers.errors || !modifiers.conversation) {
    return res.status(401).send(modifiers);
  }
  const messages = await DI.em.find(Message, {
    conversation: modifiers.conversation,
  });
  return res.status(200).json({ errors: null, data: messages });
});
export default messageRouter;
