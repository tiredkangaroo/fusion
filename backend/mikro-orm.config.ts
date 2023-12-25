import { MikroORM } from "@mikro-orm/core";
import path from "path";
import Conversation from "./entities/Conversation";
import Message from "./entities/Message";
import User from "./entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "migrations"),

    pathTs: path.join(path.resolve(), "migrations"),
    glob: "!(*.d).{js,ts}", // match migration files (all .js and .ts files, but not .d.ts)
  },
  populateAfterFlush: true,
  entities: [User, Conversation, Message],
  dbName: "fusion",
  type: "postgresql",
  debug: false,
  snapshot: false,
} as Parameters<typeof MikroORM.init>[0];
