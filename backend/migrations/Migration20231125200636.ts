import { Migration } from '@mikro-orm/migrations';

export class Migration20231125200636 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "conversation" ("_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, constraint "conversation_pkey" primary key ("_id"));');

    this.addSql('create table "user" ("_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "password" varchar(255) not null, "pfp" varchar(255) not null, constraint "user_pkey" primary key ("_id"));');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('create table "message" ("_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "text" varchar(255) not null, "image" varchar(255) not null, "user__id" varchar(255) not null, "conversation__id" varchar(255) not null, constraint "message_pkey" primary key ("_id"));');

    this.addSql('create table "user_conversations" ("user__id" varchar(255) not null, "conversation__id" varchar(255) not null, constraint "user_conversations_pkey" primary key ("user__id", "conversation__id"));');

    this.addSql('alter table "message" add constraint "message_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade;');
    this.addSql('alter table "message" add constraint "message_conversation__id_foreign" foreign key ("conversation__id") references "conversation" ("_id") on update cascade;');

    this.addSql('alter table "user_conversations" add constraint "user_conversations_user__id_foreign" foreign key ("user__id") references "user" ("_id") on update cascade on delete cascade;');
    this.addSql('alter table "user_conversations" add constraint "user_conversations_conversation__id_foreign" foreign key ("conversation__id") references "conversation" ("_id") on update cascade on delete cascade;');
  }

}
