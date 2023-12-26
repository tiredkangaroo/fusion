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
  const hitRef = useRef<HTMLDivElement>(null);
  const [ws, setWs] = useState<null | WebSocket>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  function connectToWS() {
    if (activeConversation != null) {
      const newWs = new WebSocket(
        `ws://192.168.1.201:8000/api/conversation/live/${conversations[activeConversation]._id}`,
      );
      setWs(newWs);
    }
  }
  useEffect(() => {
    connectToWS();
  }, [activeConversation, conversations]);
  if (ws && activeConversation != null) {
    ws.addEventListener("message", (e) => {
      console.log("hit");
      const { user, message } = JSON.parse(e.data);
      const tMessages = messages === null ? [] : messages;
      const newStateMessages = [
        ...tMessages,
        {
          text: message,
          user: user,
          conversation: conversations[activeConversation],
        },
      ];
      setMessages(newStateMessages as Array<MessageType>);
    });
    ws.addEventListener("close", (_) => {
      setWs(null);
    });
  }
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight + 100000;
    }
  }, [messagesRef, messages, hitRef]);
  async function handleNewMessage(e: any) {
    e.preventDefault();
    if (activeConversation != null) {
      if (ws === null || ws.readyState != ws.OPEN) {
        await axiosInstance.post("/api/message/newmessage", {
          conversation_id: conversations[activeConversation]._id,
          text: newMessageInputRef.current!.value,
        });
        const tMessages = messages === null ? [] : messages;
        const newStateMessages = [
          ...tMessages,
          {
            text: newMessageInputRef.current!.value,
            user: user,
            conversation: conversations[activeConversation],
          },
        ];
        setMessages(newStateMessages as Array<MessageType>);
      } else {
        ws.send(newMessageInputRef.current!.value);
      }
      newMessageInputRef.current!.value = "";
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
  function removeMessage(idx: number) {
    if (messages) {
      setMessages([...messages.slice(0, idx), ...messages.slice(idx + 1)]);
    }
  }
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
          <div className="overflow-y-scroll h-[70vh]" ref={messagesRef}>
            {messages.map((message, index) => (
              <Message
                key={index}
                removeMessage={() => {
                  removeMessage(index);
                }}
              >
                {message}
              </Message>
            ))}
          </div>

          <NewMessageField />
          <div className="text-slate-600 text-sm">
            Using the{" "}
            {ws && ws.readyState === ws.OPEN ? (
              "WebSocket protocol."
            ) : (
              <span>
                HTTP protocol (WebSocket is not connected).{" "}
                <button onClick={connectToWS} className="text-blue-600">
                  Retry Connection.
                </button>
              </span>
            )}
          </div>
        </div>
      );
    } else {
      return <NewMessageField />;
    }
  }
}
