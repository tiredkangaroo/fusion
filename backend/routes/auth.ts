import { Loaded } from "@mikro-orm/core";
import bcrypt from "bcrypt";
import express, { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { DI, RI } from "..";
import User from "../entities/User";
import Validate from "../inputvalidator";

const authRouter = Router();

export async function loginCheck(
  req: express.Request
): Promise<{ user: null; error: string } | { user: Loaded<User>; error: null }> {
  if (!req.cookies.session) {
    return { user: null, error: "No session." };
  }
  const userID = await RI.get(req.cookies.session);
  if (!userID) {
    return { user: null, error: "Invalid session." };
  }
  const currentUser = await DI.em.findOne(
    User,
    { _id: userID },
    { populate: ["conversations", "conversations.members"] }
  );
  if (!currentUser) {
    return { user: null, error: "Session has no user." };
  }
  return { user: currentUser, error: null };
}

authRouter.post("/signin", async (req, res) => {
  const check = Validate("signIn", req.body);
  if (check.errors) {
    return res.status(400).json(check);
  }
  const proposedUser = await DI.em.findOne(User, {
    username: req.body.username,
  });
  if (!proposedUser) {
    return res.status(404).json({ errors: ["That user does not exist."] });
  }
  const correctPassword = bcrypt.compareSync(req.body.password, proposedUser.password);
  const newSessionID = uuidv4();
  if (correctPassword) {
    RI.set(newSessionID, proposedUser._id);
    res.cookie("session", newSessionID, { maxAge: 3 * 60 * 60 * 1000, httpOnly: true });
    return res.status(200).json({ errors: null });
  } else {
    return res.status(401).json({ errors: ["Incorrect username or password."] });
  }
});

authRouter.get("/me", async (req, res) => {
  const { user, error } = await loginCheck(req);
  if (error) {
    return res.status(400).json({ errors: [error] });
  } else {
    return res.status(200).json({ data: user, errors: null });
  }
});

authRouter.post("/createaccount", async (req, res) => {
  const check = Validate("createAccount", req.body);
  if (check.errors) {
    return res.status(400).json(check);
  }

  // const id: UUID = crypto.randomUUID();
  const username = req.body.username;
  const salt = bcrypt.genSaltSync();
  const password = bcrypt.hashSync(req.body.password, salt);
  try {
    const newUser = DI.em.create(User, {
      username: username,
      password: password,
      email: req.body.email,
      phone_number: req.body.phone_number,
      pfp: "https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg",
    });
    await DI.em.persistAndFlush(newUser);
    const newSessionID = uuidv4();

    RI.set(newSessionID, newUser._id);
    res.cookie("session", newSessionID, { maxAge: 3 * 60 * 60 * 1000, httpOnly: true });
    return res.status(200).json({ errors: null });
  } catch (error) {
    return res.status(400).json({ errors: error });
  }
});

authRouter.get("/signout", async (_, res) => {
  res.cookie("session", "", { maxAge: 0, httpOnly: true });
  return res.status(200).json({ errors: null });
});

export default authRouter;
