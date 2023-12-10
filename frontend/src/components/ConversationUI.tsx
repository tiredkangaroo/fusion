import { useContext, useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { UserContext } from "../App";
import axiosInstance from "../axiosinstance";
import { ConversationType, MessageType } from "../types";
import Message from "./Message";

interface ConversationUIParamaterType {
  conversations: Array<ConversationType>;
  activeConversation: null | number;
}

export default function ConversationUI({
  conversations,
  activeConversation,
}: ConversationUIParamaterType) {
  //
  const [user] = useContext(UserContext);
  const [messages, setMessages] = useState<null | Array<MessageType>>(null);
  const newMessageInputRef = useRef<HTMLInputElement>(null);

  async function handleNewMessage(e: any) {
    e.preventDefault();
    if (activeConversation != null) {
      const res = await axiosInstance.post("/api/message/newmessage", {
        conversation_id: conversations[activeConversation]._id,
        text: newMessageInputRef.current!.value,
      });
      if (res.status === 200) {
        const newStateMessages = [
          ...messages!,
          {
            text: newMessageInputRef.current!.value,
            user: user,
            conversation: conversations[activeConversation],
          },
        ];
        setMessages(newStateMessages as Array<MessageType>);
        newMessageInputRef.current!.value = "";
      }
    }
  }
  function NewMessageField() {
    return (
      <form className="flex w-[100%] mt-5" onSubmit={handleNewMessage}>
        <input
          type="text"
          className="w-[84%] border border-1 border-black px-[1%] py-[0.5%]"
          autoFocus
          placeholder="Type message"
          ref={newMessageInputRef}
        />
        <button type="submit" className="bg-black w-[14%] ml-[1%] text-white">
          <p className="flex gap-3 ml-[25%]">
            Send <IoMdSend className="mt-1" />
          </p>
        </button>
      </form>
    );
  }
  useEffect(() => {
    async function fetchMessages() {
      if (activeConversation != null) {
        const res = await axiosInstance.get(
          `/api/message/getMessages/${conversations[activeConversation]._id}`,
        );
        setMessages(res.data.data);
        console.log(res.data.data);
      }
    }
    activeConversation != null
      ? fetchMessages()
      : console.log("Will fetch later, conversation is not selected.");
  }, [activeConversation, conversations]);
  if (activeConversation === null) {
    return (
      <div className="flex flex-row align-middle">
        <b>No conversation selected.</b>
      </div>
    );
  } else {
    if (messages) {
      return (
        <div className="flex flex-col align-middle w-[100%]">
          {messages.map((message, index) => (
            <Message key={index}>{message}</Message>
          ))}
          <NewMessageField />
        </div>
      );
    } else {
      return <NewMessageField />;
    }
  }
}
