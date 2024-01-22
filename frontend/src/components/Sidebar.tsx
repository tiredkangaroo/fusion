import { useContext } from "react";
import { IoChatbubbleOutline, IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineTaskAlt } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { ActiveViewContext } from "./Home";
import { Button } from "@/components/ui/button";

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
    <MdOutlineTaskAlt />,
    <IoDocumentTextOutline />,
    <TfiAnnouncement />,
  ];

  return (
    <div className="ml-3 float-left">
      <div className="flex flex-col gap-9">
        {buttons.map((_, index) => (
          <Button
            key={index}
            className={sidebarButtonClassName(index)}
            onClick={() => setActiveView(index)}
          >
            <span className="text-[2rem] flex flex-col items-center">
              {icons[index]}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
