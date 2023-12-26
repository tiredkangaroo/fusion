import Modal from "react-modal";
import axiosInstance from "../axiosinstance";
import { useRef, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { ConversationType } from "../types";
export default function AddMember({
  conversation_id,
  conversations,
  setConversations,
}: {
  conversation_id: string;
  conversations: Array<ConversationType>;
  setConversations: any;
}) {
  const [open, setOpen] = useState(false);
  const newMemberUsernameRef = useRef<HTMLInputElement>(null);
  async function handleAddMember(e: any) {
    if (!open) {
      console.log("Modal must be open to proceed.");
      return 1;
    }
    e.stopPropagation();
    e.preventDefault();
    console.log(`Adding member ${newMemberUsernameRef.current?.value}`);
    if (newMemberUsernameRef.current != null) {
      const res = await axiosInstance.post("/api/conversation/addmember", {
        conversation_id: conversation_id,
        username: newMemberUsernameRef.current.value,
      });
      if (res.status === 200) {
        let newConversation: Array<ConversationType> = [];
        let changedConversation: ConversationType | null = null;
        let cCI: number | null = null;
        for (let i = 0; i < conversations.length; i++) {
          if (conversations[i]._id === conversation_id) {
            console.log("hhqwr");
            changedConversation = conversations[i];
            cCI = i;
          } else {
            newConversation.push(conversations[i]);
          }
        }
        console.log(changedConversation, cCI);
        if (changedConversation && cCI != null) {
          console.log("qr");
          console.log(res);
          changedConversation.members.push(res.data.data);
          newConversation = [
            ...newConversation.slice(0, cCI),
            changedConversation,
            ...newConversation.slice(cCI),
          ];
          setConversations(newConversation);
        }
      } else {
        return 1;
      }
    }
    setOpen(false);
  }
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
        className="ml-2"
      >
        <MdOutlineAddCircleOutline />
      </button>
      <Modal isOpen={open} ariaHideApp={false} className={"w-full h-fit mt-8"}>
        <form onSubmit={(e) => handleAddMember(e)}>
          <span className="text-3xl ml-6">@</span>
          <input
            className="border-emerald-400 w-[55%] py-3 px-2 bg-transparent"
            placeholder="Username of New Member"
            autoFocus={true}
            ref={newMemberUsernameRef}
          ></input>
          <button type={"submit"} className="auth-button ml-2">
            Add
          </button>
        </form>
      </Modal>
    </>
  );
}
