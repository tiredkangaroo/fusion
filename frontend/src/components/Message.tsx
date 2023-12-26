import { useContext, useRef } from "react";
import { UserContext } from "../App";
import { MessageType } from "../types";
import { MdDeleteOutline } from "react-icons/md";
import axiosInstance from "../axiosinstance";

export default function Message(props: {
  children: MessageType;
  removeMessage: () => void;
}) {
  const [user] = useContext(UserContext);
  const messageDivRef = useRef<HTMLDivElement>(null);
  let classList = "mr-2 min-w-fit w-[15%] mt-1 text-center py-1.5 px-4";
  let parentClassList = "flex flex-row max-w-[65%]";
  console.log(props.children);
  if (props.children.user._id === user?._id) {
    classList += " bg-[#242423] text-white rounded-xl";
    parentClassList += " self-end";
  } else {
    classList += "  bg-[#cccbca] text-black rounded-xl";
    parentClassList += " self-start";
  }
  async function handleDeleteMessage() {
    await axiosInstance.post("/api/message/delete", {
      message_id: props.children._id,
    });
    console.log(props);
    props.removeMessage();
  }
  function DeleteButton() {
    if (props.children.user._id === user?._id) {
      return (
        <button className="mr-6" onClick={handleDeleteMessage}>
          <MdDeleteOutline />
        </button>
      );
    }
  }
  return (
    <div className="mt-3 w-full flex flex-col">
      {props.children.user._id === user?._id ? (
        ""
      ) : (
        <p className="text-sm text-[#595959]">
          {props.children.user.username}
          <span> &lt;{props.children.user.email}&gt;</span>
        </p>
      )}
      <div className={parentClassList}>
        <div className={classList} ref={messageDivRef}>
          {props.children.text}
        </div>
        <DeleteButton />
      </div>
    </div>
  );
}
