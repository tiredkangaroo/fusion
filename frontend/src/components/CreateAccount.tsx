import { useRef, useState } from "react";
import axiosInstance from "../axiosinstance";
import { AxiosError, isAxiosError } from "axios";
import AlertUI from "./Alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreateAccount() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<null | string[]>(null);
  const organizationIDRef = useRef<HTMLInputElement>(null);
  async function handleCreateAccount(e: SubmitEvent) {
    e.preventDefault();
    if (!(passwordRef.current?.value === passwordConfirmRef.current?.value)) {
      return 1;
    }
    try {
      const res = await axiosInstance.post("/api/auth/createaccount", {
        username: usernameRef.current!.value,
        password: passwordRef.current!.value,
        email: emailRef.current!.value,
        phone_number: phoneNumberRef.current!.value,
        organization: organizationIDRef.current!.value,
      });
      if (res.status === 200) {
        window.location.replace("/profile");
      }
    } catch (err: AxiosError | unknown) {
      if (isAxiosError(err)) {
        setErrors(err.response?.data.errors);
      } else {
        setErrors([err as string]);
      }
    }
  }
  return (
    <div className="w-[100%] min-w-fit flex flex-col items-center gap-3">
      <h1 className="text-xl">New Account @ Fusion</h1>
      <AlertUI
        title="Error! We could not create your account."
        errors={errors}
      ></AlertUI>
      <form
        onSubmit={handleCreateAccount}
        className="flex flex-col gap-3 w-full items-center"
      >
        <Label htmlFor="username">Full Name</Label>
        <input
          className="createAccountInput"
          type="text"
          ref={usernameRef}
          id="username"
          placeholder="ex. John Doe"
          autoFocus
        />
        <Label htmlFor="password">Password</Label>
        <input
          className="createAccountInput"
          type="password"
          ref={passwordRef}
          id="password"
        />
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <input
          className="createAccountInput"
          type="password"
          ref={passwordConfirmRef}
        />
        <Label htmlFor="email">Email</Label>
        <input
          className="createAccountInput"
          type="email"
          placeholder="ex. johndoe@thejohncorporation.net"
          ref={emailRef}
          id="email"
        />
        <Label htmlFor="phone_number">Phone Number</Label>
        <input
          className="createAccountInput"
          type="text"
          placeholder="1115646363"
          ref={phoneNumberRef}
          id="phone_number"
        />
        <Label htmlFor="organization">Organization ID</Label>
        <input
          className="createAccountInput"
          type="text"
          placeholder="ex. John Doe Industries and Corporation"
          ref={organizationIDRef}
          id="organization"
        />
        <Button type="submit">Get Started</Button>
      </form>
    </div>
  );
}
