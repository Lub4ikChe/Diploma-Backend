import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserResetPassword1650584776065 implements MigrationInterface {
  name = 'AddUserResetPassword1650584776065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reset_password" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "used" boolean NOT NULL, "user_id" uuid, CONSTRAINT "PK_82bffbeb85c5b426956d004a8f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "reset_password" ADD CONSTRAINT "FK_de65040d842349a5e6428ff21e6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reset_password" DROP CONSTRAINT "FK_de65040d842349a5e6428ff21e6"`,
    );
    await queryRunner.query(`DROP TABLE "reset_password"`);
  }
}
