import { Entity, ManyToMany, Property } from "@mikro-orm/core";
import User from "./User";
import Base from "./Base";

@Entity()
export default class Task extends Base {
  @Property()
  title: string;

  @Property()
  description: string;

  @ManyToMany(() => User, (user) => user.tasks)
  people: User;

  @Property()
  due_date: Date;
}
