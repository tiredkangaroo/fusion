import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity({ abstract: true })
export default abstract class Base {
  @PrimaryKey()
  _id: string = v4();

  @Property()
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();
}

export interface BaseType {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
