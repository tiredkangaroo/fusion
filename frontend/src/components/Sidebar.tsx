import { useContext } from "react";
import { IoChatbubbleOutline, IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineAssignment } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { ActiveViewContext } from "./Home";

export default function Sidebar() {
  const [activeView, setActiveView] = useContext(ActiveViewContext);

  function sidebarButtonClassName(num: number) {
    if (num === activeView) {
      return "sidebar-button sidebar-button-highlighted";
    } else {
      return "sidebar-button";
    }
  }
  const buttons = ["Chats", "Assignments", "Documents", "Public Announcements"];
  const icons = [
    <IoChatbubbleOutline />,
    <MdOutlineAssignment />,
    <IoDocumentTextOutline />,
    <TfiAnnouncement />,
  ];

  return (
    <div className="ml-3 float-left">
      <div className="flex flex-col gap-9">
        {buttons.map((_, index) => (
          <button
            key={index}
            className={sidebarButtonClassName(index)}
            onClick={() => setActiveView(index)}
          >
            <span className="text-[2rem] flex flex-col items-center">{icons[index]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
