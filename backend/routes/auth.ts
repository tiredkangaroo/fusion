import bcrypt from "bcrypt";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { DI, RI } from "..";
import User from "../entities/User";
import Validate from "../inputvalidator";

const authRouter = Router();

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
  const correctPassword = bcrypt.compareSync(
    req.body.password,
    proposedUser.password,
  );
  const newSessionID = uuidv4();
  if (correctPassword) {
    RI.set(newSessionID, proposedUser._id);
    res.cookie("session", newSessionID, {
      maxAge: 3 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(200).json({ errors: null });
  } else {
    return res
      .status(401)
      .json({ errors: ["Incorrect username or password."] });
  }
});

authRouter.get("/me", async (req, res) => {
  if (req.user) {
    res.status(200).send({ data: req.user, errors: null });
  } else {
    res.status(401).send({ data: null, error: "The user is not signed in." });
  }
});

authRouter.post("/createaccount", async (req, res) => {
  const check = Validate("createAccount", req.body);
  if (check.errors) {
    return res.status(400).json(check);
  }

  const username = req.body.username;
  const salt = bcrypt.genSaltSync();
  const password = bcrypt.hashSync(req.body.password, salt);
  try {
    const newUser = DI.em.create(User, {
      username: username,
      password: password,
      email: req.body.email,
      phone_number: req.body.phone_number,
      organization: req.body.organization,
      pfp: "https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg",
    });
    await DI.em.persistAndFlush(newUser);
    const newSessionID = uuidv4();

    RI.set(newSessionID, newUser._id);
    res.cookie("session", newSessionID, {
      maxAge: 3 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(200).json({ errors: null });
  } catch (error) {
    return res.status(400).json({ errors: error });
  }
});

authRouter.get("/signout", async (_, res) => {
  res.cookie("session", "", { maxAge: 0, httpOnly: true });
  return res.status(200).json({ errors: null });
});

authRouter.post("/changebio", async (req, res) => {
  const newBio = req.body.bio;
  return res.status(200).json({ errors: null });
});
export default authRouter;
