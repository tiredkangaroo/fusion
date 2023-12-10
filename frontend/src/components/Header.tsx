import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import axiosInstance, { acceptableCodes } from "../axiosinstance";
import { UserType } from "../types";

export default function Header() {
  const [user, setUser] = useContext(UserContext);
  useEffect(() => {
    async function fetchUser() {
      const res = await axiosInstance.get("/api/auth/me");
      if (acceptableCodes.includes(res.status)) {
        setUser(res.data.data as UserType);
      }
    }
    fetchUser();
  }, []);
  function HeaderRightSide() {
    if (user) {
      return (
        <Link to="/profile" className="float-right mt-3 mr-3 p-3">
          <img src={user.pfp} alt="" className="profile-picture w-11" />
        </Link>
      );
    } else {
      return (
        <Link to={"/signin"}>
          <button className="auth-button float-right mr-3 mt-3">Sign in</button>
        </Link>
      );
    }
  }
  return (
    <div className="text-center h-[6rem]">
      <Link to={"/"}>
        <h1 className="text-4xl bg inline-block p-[1rem] align-middle float-left">
          Fusion
        </h1>
      </Link>
      <HeaderRightSide />
    </div>
  );
}
