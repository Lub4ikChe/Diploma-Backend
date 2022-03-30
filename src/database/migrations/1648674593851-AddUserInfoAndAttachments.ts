import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserInfoAndAttachments1648674593851
  implements MigrationInterface
{
  name = 'AddUserInfoAndAttachments1648674593851';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying NOT NULL, "folder_type" character varying NOT NULL, "original_name" character varying NOT NULL, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_information" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying, "user_id" character varying NOT NULL, "attachment_id" uuid, CONSTRAINT "UQ_31c0e55a2ced8c6bf6fbecd0306" UNIQUE ("user_id"), CONSTRAINT "REL_4d43081fc1349d981beb311cde" UNIQUE ("attachment_id"), CONSTRAINT "PK_f7fa43b43a7a288d5c5a1fedfec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "user_information_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_5729817bce2357a05e49bb4d1b6" UNIQUE ("user_information_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_information" ADD CONSTRAINT "FK_4d43081fc1349d981beb311cdec" FOREIGN KEY ("attachment_id") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_5729817bce2357a05e49bb4d1b6" FOREIGN KEY ("user_information_id") REFERENCES "user_information"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_5729817bce2357a05e49bb4d1b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_information" DROP CONSTRAINT "FK_4d43081fc1349d981beb311cdec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_5729817bce2357a05e49bb4d1b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "user_information_id"`,
    );
    await queryRunner.query(`DROP TABLE "user_information"`);
    await queryRunner.query(`DROP TABLE "attachment"`);
  }
}
