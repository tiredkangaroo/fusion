import { useRef, useState } from "react";
import Modal from "react-modal";
import { MdOutlineEdit } from "react-icons/md";
import axiosInstance from "../axiosinstance";

export default function EditTitle({
  conversation_id,
  currentTitle,
}: {
  conversation_id: string;
  currentTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const newTitleRef = useRef<HTMLInputElement>(null);
  async function handleEditTitle(e: any) {
    e.preventDefault();
    const res = await axiosInstance.post("/api/conversation/setTitle", {
      conversation_id: conversation_id,
      title: newTitleRef.current!.value,
    });
    if (res.status === 200) {
      setOpen(false);
      window.location.replace("/");
    }
  }
  return (
    <div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="ml-3 mt-3"
      >
        <MdOutlineEdit />
      </button>
      <Modal
        isOpen={open}
        ariaHideApp={false}
        className={"w-[100%] bg-transparent flex flex-col items-center"}
      >
        <form onSubmit={handleEditTitle} className="mt-[2vh]">
          <input
            type="text"
            autoFocus
            ref={newTitleRef}
            placeholder={currentTitle}
            className="py-1.5 px-2"
          />
          <button type="submit" className="auth-button ml-3">
            {" "}
            Set Title{" "}
          </button>
        </form>
      </Modal>
    </div>
  );
}
