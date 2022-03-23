import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAndTokenAndInviteTables1648034960522
  implements MigrationInterface
{
  name = 'AddUserAndTokenAndInviteTables1648034960522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hash" character varying, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "status" character varying NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "user_invite_id" uuid, "user_refresh_token_id" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_0064ac33559d19ba940b20d564" UNIQUE ("user_invite_id"), CONSTRAINT "REL_4663dca19d67c7d7a571d60154" UNIQUE ("user_refresh_token_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_invite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" uuid NOT NULL DEFAULT uuid_generate_v4(), "used" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_8108c55aa759aab27050cc06607" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_0064ac33559d19ba940b20d5645" FOREIGN KEY ("user_invite_id") REFERENCES "user_invite"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_4663dca19d67c7d7a571d601543" FOREIGN KEY ("user_refresh_token_id") REFERENCES "refresh_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_4663dca19d67c7d7a571d601543"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_0064ac33559d19ba940b20d5645"`,
    );
    await queryRunner.query(`DROP TABLE "user_invite"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
  }
}
