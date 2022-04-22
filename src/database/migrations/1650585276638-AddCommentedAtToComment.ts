import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommentedAtToComment1650585276638
  implements MigrationInterface
{
  name = 'AddCommentedAtToComment1650585276638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "commented_at" TIMESTAMP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "commented_at"`);
  }
}
