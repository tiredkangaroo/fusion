import { Migration } from '@mikro-orm/migrations';

export class Migration20231126171710 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "message" alter column "image" type varchar(255) using ("image"::varchar(255));');
    this.addSql('alter table "message" alter column "image" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "message" alter column "image" type varchar(255) using ("image"::varchar(255));');
    this.addSql('alter table "message" alter column "image" set not null;');
  }

}
