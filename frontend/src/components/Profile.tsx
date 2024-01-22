import { useContext, useState } from "react";
import { UserContext } from "../App";
import axiosInstance from "../axiosinstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const [user] = useContext(UserContext);
  const [open, setOpen] = useState(false);
  async function Logout() {
    await axiosInstance.get("/api/auth/signout");
    window.location.href = "/";
  }
  async function handleChangeBio() {
    await axiosInstance.get("/api/auth/changebio");
    window.location.href = window.location.href;
  }
  if (user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">
            {user.username}{" "}
            {user?.organization
              ? `(${user?.organization})`
              : "(No Organization)"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={open} onOpenChange={setOpen} className="h-[55%]">
            <Label htmlFor="bio">Biography</Label>
            <DialogTrigger>
              <Button className="w-12 h-6 ml-2 px-4">Edit</Button>
            </DialogTrigger>
            <p id="bio" className="mb-8">
              {user.bio ? user.bio : "No biography provided."}
            </p>
            <DialogContent className="h-[35%] min-h-fit">
              <h1 className="text-center">Edit Biography</h1>
              <form onSubmit={handleChangeBio}>
                <h2>New Biography</h2>
                <textarea
                  id="newbio"
                  autoFocus={true}
                  className="w-full resize-none h-[70%] border-2 border-black px-2 py-2"
                  maxLength={200}
                ></textarea>
                <Button type="submit">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Label htmlFor="email">Email</Label>
          <p id="email" className="mb-8">
            <a
              className="text-blue-500 hover:text-blue-800 underline"
              href={`mailto:${user.email}`}
            >
              {user.email}
            </a>
          </p>
          <Label htmlFor="pfp">Profile Picture</Label>
          <img src={user.pfp} className="w-16" />
          <Button onClick={Logout} className="mt-8" variant={"destructive"}>
            Logout
          </Button>
        </CardContent>
      </Card>
      // <AlertUI
      //   title="Error! We could not save the information."
      //   errors={["User does not exist."]}
      // />
    );
  } else {
    return <h1></h1>;
  }
}
