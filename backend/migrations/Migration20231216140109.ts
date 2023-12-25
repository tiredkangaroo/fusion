import { Migration } from '@mikro-orm/migrations';

export class Migration20231216140109 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "task" ("_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "description" varchar(255) not null, "due_date" timestamptz(0) not null, constraint "task_pkey" primary key ("_id"));');

    this.addSql('create table "user_tasks" ("user__id" varchar(255) not null, "task__id" varchar(255) not null, constraint "user_tasks_pkey" primary key ("user__id", "task__id"));');

    this.addSql('alter table "user_tasks" add constraint "user_tasks_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "user_tasks" add constraint "user_tasks_task__id_foreign" foreign key ("task__id") references "task" ("_id") on update cascade on delete cascade;');

    this.addSql('alter table "conversation" add column "title" varchar(255) null;');

    this.addSql('alter table "user" add column "email" varchar(255) null, add column "phone_number" varchar(255) null;');

    this.addSql('alter table "message" alter column "text" type varchar(255) using ("text"::varchar(255));');
    this.addSql('alter table "message" alter column "text" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_tasks" drop constraint "user_tasks_task__id_foreign";');

    this.addSql('drop table if exists "task" cascade;');

    this.addSql('drop table if exists "user_tasks" cascade;');

    this.addSql('alter table "conversation" drop column "title";');

    this.addSql('alter table "user" drop column "email";');
    this.addSql('alter table "user" drop column "phone_number";');

    this.addSql('alter table "message" alter column "text" type varchar(255) using ("text"::varchar(255));');
    this.addSql('alter table "message" alter column "text" set not null;');
  }

}
