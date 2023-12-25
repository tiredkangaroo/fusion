import { useRef } from "react";
import axiosInstance from "../axiosinstance";

export default function CreateAccount() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  async function handleCreateAccount(e: any) {
    e.preventDefault();
    if (!(passwordRef.current?.value === passwordConfirmRef.current?.value)) {
      return 1;
    }
    const res = await axiosInstance.post("/api/auth/createaccount", {
      username: usernameRef.current!.value,
      password: passwordRef.current!.value,
      email: emailRef.current!.value,
      phone_number: phoneNumberRef.current!.value,
    });
    if (res.status === 200) {
      window.location.replace("/profile");
    }
  }
  return (
    <div className="w-[100%] min-w-fit flex flex-col items-center gap-3">
      <h1 className="text-xl">New Account @ Fusion</h1>
      <form onSubmit={handleCreateAccount}>
        <input
          className="createAccountInput"
          type="text"
          placeholder="Username"
          ref={usernameRef}
          autoFocus
        />
        <input
          className="createAccountInput"
          type="password"
          placeholder="Password"
          ref={passwordRef}
        />
        <input
          className="createAccountInput"
          type="password"
          placeholder="Confirm Password"
          ref={passwordConfirmRef}
        />
        <input
          className="createAccountInput"
          type="email"
          placeholder="Email Address"
          ref={emailRef}
        />
        <input
          className="createAccountInput"
          type="text"
          placeholder="Phone Number"
          ref={phoneNumberRef}
        />
        <button type="submit" className="auth-button float-right mt-4">
          Get Started
        </button>
      </form>
    </div>
  );
}
