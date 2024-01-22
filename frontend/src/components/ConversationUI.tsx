import { useContext, useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { UserContext } from "../App";
import axiosInstance from "../axiosinstance";
import { ConversationType, MessageType } from "../types";
import Message from "./Message";
import { Button } from "@/components/ui/button";
import { MdOutlineTaskAlt } from "react-icons/md";
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
  const fileDropRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
      const { _id, user, message } = JSON.parse(e.data);
      const tMessages = messages === null ? [] : messages;
      const newStateMessages = [
        ...tMessages,
        {
          _id: _id,
          text: message,
          user: user,
          conversation: conversations[activeConversation],
        },
      ];
      setMessages(newStateMessages as Array<MessageType>);
    });
    ws.addEventListener("close", () => {
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
    if (
      activeConversation != null &&
      newMessageInputRef.current?.value &&
      newMessageInputRef.current.value.replace(/ /g, "").length > 0
    ) {
      if (ws === null || ws.readyState != ws.OPEN) {
        const res = await axiosInstance.post("/api/message/newmessage", {
          conversation_id: conversations[activeConversation]._id,
          text: newMessageInputRef.current!.value,
        });
        if (!(res.status === 200)) {
          console.error(res.data.errors);
          return 1;
        }
        const tMessages = messages === null ? [] : messages;
        const newStateMessages = [
          ...tMessages,
          {
            _id: res.data.data._id,
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
      <form
        className="flex w-[100%] mt-5"
        onSubmit={(ev) => handleNewMessage(ev)}
      >
        <Button type="button" className="mr-1">
          Tasks <MdOutlineTaskAlt className="ml-2" />
        </Button>
        <input
          type="text"
          className="w-[84%] border border-1 border-black px-[1%] py-[0.5%]"
          autoFocus
          placeholder="Type message"
          ref={newMessageInputRef}
        />
        <Button type="submit" className="bg-black ml-1 mr-1 text-white">
          <p className="flex gap-3">
            Send <IoMdSend className="mt-1" />
          </p>
        </Button>
      </form>
    );
  }
  useEffect(() => {
    async function fetchMessages() {
      if (activeConversation != null) {
        const res = await axiosInstance.get(
          `/api/message/getMessages/${conversations[activeConversation]._id}`,
        );
        setLoading(false);
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
  function handleFile(file: File) {
    console.log(file.name);
  }
  function handleDragOver(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
  }
  function handleDrop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    const items = ev.dataTransfer.items;
    const files = ev.dataTransfer.files;
    if (items) {
      [...items].forEach((item) => {
        if (item.kind === "file") {
          handleFile(item.getAsFile() as File);
        }
      });
    } else {
      [...files].forEach((file) => {
        handleFile(file);
      });
    }
  }
  if (loading && activeConversation) {
    return (
      <svg
        aria-hidden="true"
        className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    );
  }
  if (activeConversation === null) {
    return (
      <div className="flex flex-row align-middle dark:text-white">
        <b>No conversation selected.</b>
      </div>
    );
  } else {
    if (messages) {
      return (
        <div
          className="flex flex-col align-middle w-[100%]"
          onDragOver={(ev) => {
            handleDragOver(ev);
          }}
          onDrop={(ev) => {
            handleDrop(ev);
          }}
          ref={fileDropRef}
        >
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
