import { useRef, useState } from "react";
import { IoChatbubbleOutline } from "react-icons/io5";
import { LuSend } from "react-icons/lu";
import axiosInstance from "../axiosinstance";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import AlertUI from "./Alert";
import axios, { AxiosError } from "axios";

export default function NewConversationModal() {
  const membersRef = useRef<null | HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  async function startNewConversation(e: SubmitEvent) {
    e.preventDefault();
    let res;
    try {
      res = await axiosInstance.post("/api/conversation/startconversation", {
        members: membersRef.current?.value,
      });
      if (res.status === 200) {
        setOpen(false);
      } else {
        setErrors(res.data.errors);
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setErrors(e.response!.data.errors);
      } else {
        console.error(e);
      }
    }
  }
  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="w-full bg-black text-white flex gap-3 px-3 py-1 rounded-xl text-base mt-1 text-center">
            <IoChatbubbleOutline className={"mt-1 mr-5"} /> New Conversation
          </div>
        </DialogTrigger>
        <DialogContent>
          <h1 className="text-center">Start Conversation</h1>
          <div className="flex flex-col flex-grow-1">
            <AlertUI
              title="Error! We were unable to create a new conversation."
              errors={errors}
            ></AlertUI>
            <form className="mt-2" onSubmit={startNewConversation}>
              <div className="text-xl">
                <p>Recipent(s):</p>
                <input
                  type="text"
                  className="border border-black pl-2 rounded-xl w-full mt-1 py-2"
                  autoFocus
                  ref={membersRef}
                />
                {/* <p className="mt-2">Message</p>
            <textarea
              className="rounded-xl w-full border border-black mt-1 py-2 pl-2 flex-grow-1"
              rows={5}
            /> */}
                <button
                  className="bg-black text-white flex gap-3 px-3 py-1 rounded-xl text-base mt-3"
                  type="submit"
                >
                  <LuSend className={"mt-1"} />
                  Send
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
