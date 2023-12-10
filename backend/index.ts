import { MikroORM } from "@mikro-orm/core";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createClient } from "redis";
import User from "./entities/User";
import authRouter from "./routes/auth";
import conversationRouter from "./routes/conversation";
import messageRouter from "./routes/message";
import { DatabaseInterface } from "./types";

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

export const DI = {} as DatabaseInterface;
export let RI = {} as ReturnType<typeof createClient>;

app.use("/api/auth", authRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);

//mikroORM setup
async function MikroORMSetup() {
  DI.orm = await MikroORM.init();
  await DI.orm.getMigrator().up();
  const generator = DI.orm.getSchemaGenerator();
  await generator.updateSchema();
  DI.em = DI.orm.em.fork();
  DI.userRepository = DI.em.getRepository(User);
}

MikroORMSetup();

async function RedisSetup() {
  RI = await createClient()
    .on("error", (err) => console.warn(err))
    .connect();
}

RedisSetup();

app.get("/image/:id", (req, res) => {
  const id = req.params.id;
  if (id) {
    res.sendFile(`${__dirname}/images/${id}`);
  }
});

app.listen(port, () => {
  console.log(`The webserver has started on http://localhost:${port} 🚀`);
});
