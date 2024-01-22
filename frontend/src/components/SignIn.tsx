import { useRef } from "react";
import axiosInstance from "../axiosinstance";
import { Link } from "react-router-dom";

export default function SignIn() {
  const usernameRef = useRef<null | HTMLInputElement>(null);
  const passwordRef = useRef<null | HTMLInputElement>(null);
  async function handleSignIn(e: any) {
    e.preventDefault();
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;
    if (!username) {
      return 1;
    }
    if (!password) {
      return 1;
    }
    const res = await axiosInstance.post(
      `/api/auth/signin`,
      {
        username: username,
        password: password,
      },
      {
        withCredentials: true,
      },
    );
    if (res.status != 200) {
      return 1;
    }
    window.location.href = "/";
  }
  return (
    <div className="w-100vw flex flex-col">
      <form
        className="bg-white rounded px-8 pt-6 pb-8 mb-4 border self-center min-w-3xl w-[45%] max-w-5xl"
        onSubmit={handleSignIn}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            id="username"
            type="text"
            autoFocus={true}
            ref={usernameRef}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            ref={passwordRef}
          />
        </div>
        <div className="flex items-center justify-between flex-col">
          <button
            className="auth-button focus:outline-none focus:shadow-outline text-center"
            type="submit"
          >
            Sign In
          </button>
        </div>
        <p className="text-center mt-4">
          New to Fusion?
          <Link to={"/createaccount"} className="text-blue-500 ml-1">
            Get Started
          </Link>
        </p>
      </form>
    </div>
  );
}
