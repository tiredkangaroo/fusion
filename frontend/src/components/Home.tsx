import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { UserContext } from "../App";
import Chat from "./Chats";
import HomeNoAuth from "./HomeNoAuth";
import Sidebar from "./Sidebar";
import Tasks from "./Tasks";

type ActiveViewContextType = [number, Dispatch<SetStateAction<number>>];
export const ActiveViewContext = createContext<ActiveViewContextType>([
  0,
  () => {},
]);

export default function Home() {
  const [user] = useContext(UserContext);
  const [activeView, setActiveView] = useState(0);
  function Display() {
    switch (activeView) {
      case 0:
        return <Chat />;
      case 1:
        return <Tasks />;
      default:
        return <Chat />;
    }
    if (activeView === 0) {
      return <Chat />;
    }
  }
  function HomeAuth() {
    return (
      <div className="flex flex-row">
        <div className="items-start h-fit">
          <Sidebar />
        </div>
        <div className="grow-[100] h-fit">
          <Display />
        </div>
      </div>
    );
  }
  return (
    <div>
      <ActiveViewContext.Provider value={[activeView, setActiveView]}>
        {user ? <HomeAuth /> : <HomeNoAuth />}
      </ActiveViewContext.Provider>
    </div>
  );
}
