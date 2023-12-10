import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core";
import User from "./entities/User";

export interface DatabaseInterface {
	orm: MikroORM;
	em: EntityManager;
	userRepository: EntityRepository<User>;
}