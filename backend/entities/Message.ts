import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import Base from "./Base";
import Conversation from "./Conversation";
import User from "./User";

@Entity()
export default class Message extends Base {
  @Property({ nullable: true })
  text?: string;

  @Property({ nullable: true })
  image?: string; //link

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Conversation)
  conversation: Conversation;
}
