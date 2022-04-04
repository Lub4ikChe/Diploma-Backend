import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTrackCommentModels1649110182714 implements MigrationInterface {
  name = 'AddTrackCommentModels1649110182714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "text" character varying, "listens_count" integer NOT NULL DEFAULT '0', "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), "uploaded_by_id" uuid, "audio_attachment_id" uuid, "image_attachment_id" uuid, CONSTRAINT "REL_ee40bb7b4fa91d8df2f136325a" UNIQUE ("audio_attachment_id"), CONSTRAINT "REL_39b11b3fbc4e49a8ffefdba96e" UNIQUE ("image_attachment_id"), CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "author_id" uuid, "track_id" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_25092298b763ab8f30b70c73501" FOREIGN KEY ("uploaded_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_ee40bb7b4fa91d8df2f136325ab" FOREIGN KEY ("audio_attachment_id") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_39b11b3fbc4e49a8ffefdba96ea" FOREIGN KEY ("image_attachment_id") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_3ce66469b26697baa097f8da923" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_8a06e34a10954c1d76d254aa8bf" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_8a06e34a10954c1d76d254aa8bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_3ce66469b26697baa097f8da923"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_39b11b3fbc4e49a8ffefdba96ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_ee40bb7b4fa91d8df2f136325ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_25092298b763ab8f30b70c73501"`,
    );
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "track"`);
  }
}
