import { Collection, Entity, ManyToMany, OneToMany, Property, Unique } from "@mikro-orm/core";
import Base, { BaseType } from "./Base";
import Conversation from "./Conversation";
import Message from "./Message";

@Entity()
export default class User extends Base {
  @Unique()
  @Property()
  username: string;

  @Property({ hidden: true })
  password: string;

  @Property({ nullable: true })
  email: string;

  @Property({ nullable: true })
  phone_number: string;

  @Property()
  pfp: string;

  @ManyToMany(() => Conversation, "members", { owner: true })
  conversations? = new Collection<Conversation>(this);

  @OneToMany(() => Message, "user")
  messages? = new Collection<Message>(this);
}

export interface UserType extends BaseType {
  username: string;
  password: string;
  email: string;
  phone_number?: string;
  pfp: string;
  conversations?: Collection<Message>;
  messages?: Collection<Message>;
}
