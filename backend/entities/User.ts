import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import Base, { BaseType } from "./Base";
import Conversation from "./Conversation";
import Message from "./Message";
import Task from "./Task";

@Entity()
export default class User extends Base {
  @Index()
  @Property()
  username: string;

  @Property({ hidden: true })
  password: string;

  @Index()
  @Property({ nullable: true })
  email: string;

  @Index()
  @Property({ nullable: true })
  phone_number?: string;

  @Property()
  pfp: string;

  @Property({ nullable: true })
  bio?: string;

  @Property({ nullable: true })
  organization?: string;

  @ManyToMany(() => Conversation, "members", { owner: true })
  conversations? = new Collection<Conversation>(this);

  @OneToMany(() => Message, "user")
  messages? = new Collection<Message>(this);

  @ManyToMany(() => Task, "people", { owner: true })
  tasks? = new Collection<Task>(this);
}

export interface UserType extends BaseType {
  username: string;
  password: string;
  email: string;
  bio?: string;
  phone_number?: string;
  pfp: string;
  conversations?: Collection<Message>;
  messages?: Collection<Message>;
}
