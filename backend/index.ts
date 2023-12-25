import { MikroORM } from "@mikro-orm/core";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createClient } from "redis";
import User from "./entities/User";
import { DatabaseInterface } from "./types";
import authenticateRoutes from "./middleware/auth";
import WebSocket from "ws";
import http from "http";

const app = express();
const port = 8000;
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://192.168.1.201:5173", credentials: true }));

export const DI = {} as DatabaseInterface;
export let RI = {} as ReturnType<typeof createClient>;
export const CI = new Map();
export const WSSI = new WebSocket.Server({ noServer: true });
app.use(authenticateRoutes);

import authRouter from "./routes/auth";
import conversationRouter from "./routes/conversation";
import messageRouter from "./routes/message";
import mikroOrmConfig from "./mikro-orm.config";

app.use("/api/auth", authRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);

//mikroORM setup
async function MikroORMSetup() {
  DI.orm = await MikroORM.init(mikroOrmConfig);
  await DI.orm.getMigrator().up();
  const generator = DI.orm.getSchemaGenerator();
  await generator.updateSchema();
  DI.em = DI.orm.em.fork();
  DI.userRepository = DI.em.getRepository(User);
  console.log("MikroORM has been set up!");
}

MikroORMSetup();

async function RedisSetup() {
  RI = await createClient()
    .on("error", (err) => console.warn(err))
    .connect();
  console.log("Redis has been set up!");
}

RedisSetup();

app.get("/image/:id", (req, res) => {
  const id = req.params.id;
  if (id) {
    res.sendFile(`${__dirname}/images/${id}`);
  }
});
server.on("upgrade", (request, socket, head) => {
  WSSI.handleUpgrade(request, socket, head, (ws) => {
    WSSI.emit("connection", ws, request);
  });
});
server.listen(port, "0.0.0.0", 511, () => {
  console.log("The backend server has started!");
});
