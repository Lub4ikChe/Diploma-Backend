import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLikedTracks1650224631208 implements MigrationInterface {
  name = 'AddLikedTracks1650224631208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_liked_tracks" ("user_id" uuid NOT NULL, "track_id" uuid NOT NULL, CONSTRAINT "PK_b9d60131d929839c470df1d966e" PRIMARY KEY ("user_id", "track_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c69738fee75ec73e44e1a20872" ON "user_liked_tracks" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_51cbf1b2c3a5956c8d411f871b" ON "user_liked_tracks" ("track_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_liked_tracks" ADD CONSTRAINT "FK_c69738fee75ec73e44e1a20872c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_liked_tracks" ADD CONSTRAINT "FK_51cbf1b2c3a5956c8d411f871be" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_liked_tracks" DROP CONSTRAINT "FK_51cbf1b2c3a5956c8d411f871be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_liked_tracks" DROP CONSTRAINT "FK_c69738fee75ec73e44e1a20872c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_51cbf1b2c3a5956c8d411f871b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c69738fee75ec73e44e1a20872"`,
    );
    await queryRunner.query(`DROP TABLE "user_liked_tracks"`);
  }
}
