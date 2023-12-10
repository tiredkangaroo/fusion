import { useContext, useRef } from "react";
import { UserContext } from "../App";
import { MessageType } from "../types";

export default function Message(props: { children: MessageType }) {
  const [user] = useContext(UserContext);
  const messageDivRef = useRef<HTMLDivElement>(null);
  let classList = "mr-3 min-w-fit w-[15%] mt-2 text-center py-1.5 px-4";
  if (props.children.user._id === user?._id) {
    classList += " self-end bg-[#242423] text-white";
  } else {
    classList += " self-start bg-[#cccbca] text-black";
  }
  return (
    <div className={classList} ref={messageDivRef}>
      {props.children.text}
    </div>
  );
}
