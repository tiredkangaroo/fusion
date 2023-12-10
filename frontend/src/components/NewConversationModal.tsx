import { useRef, useState } from "react";
import { FaRegWindowClose } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { LuSend } from "react-icons/lu";
import Modal from "react-modal";
import axiosInstance from "../axiosinstance";

interface NewConversationModalPropsType {
  invokeRefresh: Function;
}
export default function NewConversationModal(
  props: NewConversationModalPropsType
) {
  const membersRef = useRef<null | HTMLInputElement>(null);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      minWidth: "fit-content",
      minHeight: "fit-content",
      width: "45%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const [open, setOpen] = useState(false);

  async function startNewConversation() {
    const res = await axiosInstance.post(
      "/api/conversation/startconversation",
      {
        members: membersRef.current?.value,
      }
    );
    if (res.status === 200) {
      await props.invokeRefresh();
      closeModal();
    }
  }
  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <div className="w-full">
      <button onClick={openModal} className="w-full">
        <div className=" w-full bg-black text-white flex gap-3 px-3 py-1 rounded-xl text-base mt-1 text-center">
          <IoChatbubbleOutline className={"mt-1 mr-5"} /> New Conversation
        </div>
      </button>
      <Modal
        isOpen={open}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="float-right">
          <button onClick={closeModal} className="text-3xl">
            <FaRegWindowClose />
          </button>
        </div>
        <h1 className="text-center">Start Conversation</h1>
        <div className="flex flex-col flex-grow-1">
          <div className="text-xl">
            <p>Recipent(s)</p>
            <input
              type="text"
              className="border border-black pl-2 rounded-xl w-full mt-1 py-2"
              autoFocus
              ref={membersRef}
            />
            {/* <p className="mt-2">Message</p>
            <textarea
              className="rounded-xl w-full border border-black mt-1 py-2 pl-2 flex-grow-1"
              rows={5}
            /> */}
            <button
              className="bg-black text-white flex gap-3 px-3 py-1 rounded-xl text-base mt-3"
              onClick={startNewConversation}
            >
              <LuSend className={"mt-1"} />
              Send
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
