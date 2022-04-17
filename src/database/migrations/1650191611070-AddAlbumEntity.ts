import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAlbumEntity1650191611070 implements MigrationInterface {
  name = 'AddAlbumEntity1650191611070';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "image_attachment_id" uuid, "author_id" uuid, CONSTRAINT "REL_09221a6cddf5568fb3639162c5" UNIQUE ("image_attachment_id"), CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "track" ADD "album_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_09221a6cddf5568fb3639162c51" FOREIGN KEY ("image_attachment_id") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_1039f92f59250d3143bc8f59484" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_5902805b5cdc8b4fcf983f7df52" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_5902805b5cdc8b4fcf983f7df52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "FK_1039f92f59250d3143bc8f59484"`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "FK_09221a6cddf5568fb3639162c51"`,
    );
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "album_id"`);
    await queryRunner.query(`DROP TABLE "album"`);
  }
}
