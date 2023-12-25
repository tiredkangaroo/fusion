import { useContext, useRef } from "react";
import { UserContext } from "../App";
import { MessageType } from "../types";

export default function Message(props: { children: MessageType }) {
  const [user] = useContext(UserContext);
  const messageDivRef = useRef<HTMLDivElement>(null);
  let classList = "mr-3 min-w-fit w-[15%] mt-1 text-center py-1.5 px-4";
  console.log(props.children);
  if (props.children.user._id === user?._id) {
    classList += " self-end bg-[#242423] text-white rounded-xl";
  } else {
    classList += " self-start bg-[#cccbca] text-black rounded-xl";
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
      <div className={classList} ref={messageDivRef}>
        {props.children.text}
      </div>
    </div>
  );
}
