import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1761435149398 implements MigrationInterface {
    name = 'Auto1761435149398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deputy" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "deputy" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "deputy" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "deputy" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deputy" ADD "partyAcronym" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deputy" ADD "stateAcronym" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deputy" ADD "photoUrl" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deputy" DROP COLUMN "photoUrl"`);
        await queryRunner.query(`ALTER TABLE "deputy" DROP COLUMN "stateAcronym"`);
        await queryRunner.query(`ALTER TABLE "deputy" DROP COLUMN "partyAcronym"`);
        await queryRunner.query(`ALTER TABLE "deputy" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "deputy" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "deputy" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deputy" ADD "firstName" character varying NOT NULL`);
    }

}
