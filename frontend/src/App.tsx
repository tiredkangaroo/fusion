import { Dispatch, SetStateAction, createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Profile from "./components/Profile";
import SignIn from "./components/SignIn";
import { UserType } from "./types";
import CreateAccount from "./components/CreateAccount";

type UserContextType = [
  null | UserType,
  Dispatch<SetStateAction<null | UserType>>,
];
export const UserContext = createContext<UserContextType>([null, () => {}]);

function App() {
  const [user, setUser] = useState<null | UserType>(null);

  return (
    <BrowserRouter>
      <UserContext.Provider value={[user, setUser]}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/createaccount" element={<CreateAccount />}></Route>
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
