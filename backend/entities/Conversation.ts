import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
  Unique,
} from "@mikro-orm/core";
import Base from "./Base";
import Message from "./Message";
import User from "./User";

@Entity()
export default class Conversation extends Base {
  @Property({ nullable: true })
  title?: string | null;

  @ManyToMany(() => User, (user) => user.conversations)
  @Unique()
  members = new Collection<User>(this);

  @OneToMany(() => Message, "conversation")
  messages? = new Collection<Message>(this);
}
