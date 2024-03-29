import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axiosInstance from "../axiosinstance";
import { ConversationType } from "../types";
import ConversationUI from "./ConversationUI";
import NewConversationModal from "./NewConversationModal";
import EditTitle from "./EditTitleModal";
import AddMember from "./AddMember";
export default function Chats() {
  const [user] = useContext(UserContext);
  const [activeConversation, setActiveConversation] = useState<null | number>(
    null,
  );
  const [conversations, setConversations] =
    useState<null | Array<ConversationType>>(null);
  async function fetchConversations() {
    const res = await axiosInstance.get("/api/conversation/myconversations");
    if (res.status != 200) {
      return 1;
    }
    setConversations(res.data.data);
  }
  useEffect(() => {
    fetchConversations();
  }, []);

  function chatUserClassName(index: number) {
    if (activeConversation === index) {
      return "chat-user chat-user-highlighted";
    } else {
      return "chat-user";
    }
  }
  function ConversationListDisplay({
    conversation,
  }: {
    conversation: ConversationType;
  }) {
    console.log(conversations);
    return (
      <div className="flex flex-col items-center w-[100%]">
        <div className="text-center flex flex-row">
          {conversation.title ? conversation.title : "(Untitled)"}
          <EditTitle conversation_id={conversation._id} currentTitle={""} />
          <AddMember
            conversation_id={conversation._id}
            conversations={conversations}
            setConversations={setConversations}
          />
        </div>
        {conversation.members.map((member, idx) => {
          if (member.username != user!.username)
            return (
              <div key={idx} className="flex gap-3 mt-2">
                <span>
                  <img src={member.pfp} className="profile-picture w-8" />
                </span>
                <p className="leading-3 mt-2">{member.username}</p>
              </div>
            );
        })}
      </div>
    );
  }
  useEffect(() => {
    if (activeConversation != null && conversations) {
      localStorage.setItem(
        "lastOpenedConversation",
        conversations[activeConversation]._id,
      );
    }
  }, [activeConversation, conversations]);
  useEffect(() => {
    if (!activeConversation && conversations) {
      const lastOpenedConversation = localStorage.getItem(
        "lastOpenedConversation",
      );
      if (lastOpenedConversation != null) {
        for (let i = 0; i < conversations.length; i++) {
          if (conversations[i]._id === lastOpenedConversation) {
            return setActiveConversation(i);
          }
        }
      }
    }
  }, [conversations, activeConversation]);

  if (conversations && user) {
    return (
      <div className="ml-4 flex flex-col">
        <h1 className="text-3xl dark:text-white">Chats</h1>
        <hr />
        <div className="flex flex-row gap-4">
          <div className="flex flex-col float-left gap-9 mt-5">
            <NewConversationModal />
            <div className="overflow-y-scroll h-[70vh] flex flex-col gap-y-5">
              {conversations.map((conversation, index) => (
                <div
                  className={chatUserClassName(index)}
                  key={index}
                  onClick={() => setActiveConversation(index)}
                >
                  <ConversationListDisplay conversation={conversation} />
                </div>
              ))}
            </div>
          </div>
          <div className="grow-[100] mt-5">
            <ConversationUI
              conversations={conversations}
              activeConversation={activeConversation}
            />
          </div>
        </div>
      </div>
    );
  }
}
