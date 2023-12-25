import { NextFunction, Request, Response } from "express";
import { DI, RI } from "..";
import User from "../entities/User";
export default async function authenticateRoutes(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.cookies.session) {
    console.log("No session.");
    req.user = null;
    return next();
  }
  const userID = await RI.get(req.cookies.session);
  if (!userID) {
    console.log("No session with session.");
    req.user = null;
    return next();
  }

  const currentUser = await DI.em.findOne(
    User,
    { _id: userID },
    {
      populate: [
        "conversations",
        "conversations.members",
        "conversations.members.email",
        "conversations.members.username",
        "conversations.members.pfp",
        "conversations.members._id",
      ],
    },
  );
  if (currentUser) {
    req.user = currentUser;
    return next();
  } else {
    console.log("No user with session.");
    req.user = null;
    return next();
  }
}
