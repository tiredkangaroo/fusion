import { EntityData } from "@mikro-orm/core";
import User from "./entities/User";

declare global {
  namespace Express {
    interface Request {
      user: EntityData<User> | null; // Replace YourUserType with the actual type of your user object
    }
  }
}
