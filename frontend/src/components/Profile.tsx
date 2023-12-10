import { useContext } from "react";
import { UserContext } from "../App";
import axiosInstance from "../axiosinstance";

export default function Profile() {
  const [user, _] = useContext(UserContext);
  async function Logout() {
    await axiosInstance.get("/api/auth/signout");
    window.location.href = "/";
  }
  if (user) {
    return (
      <div className="ml-3">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">{user.username}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">No bio for user yet.</p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Profile Picture</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <img src={user.pfp} alt="" className="profile-picture w-14" />
              </dd>
            </div>
          </dl>
        </div>
        <button
          className="align-middle bg-[#ff3a3a] hover:bg-[#ff5a5a] text-black py-2 px-4 rounded-md mt-3 mr-3"
          onClick={Logout}
        >
          Logout
        </button>
      </div>
    );
  } else {
    return <h1>no</h1>;
  }
}
