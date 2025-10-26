import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1761449013124 implements MigrationInterface {
    name = 'Auto1761449013124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "consolidated_expenses" ("id" SERIAL NOT NULL, "mostFrequentType" character varying NOT NULL, "expensesSum" numeric NOT NULL, "expensesQuantity" integer NOT NULL, "averageMonthlyExpense" numeric NOT NULL, "deputyId" integer, CONSTRAINT "REL_f9c642007eee21e4a829bf2aa5" UNIQUE ("deputyId"), CONSTRAINT "PK_2cc12eab822cdfa024b7dd29532" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "consolidated_expenses" ADD CONSTRAINT "FK_f9c642007eee21e4a829bf2aa5e" FOREIGN KEY ("deputyId") REFERENCES "deputy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consolidated_expenses" DROP CONSTRAINT "FK_f9c642007eee21e4a829bf2aa5e"`);
        await queryRunner.query(`DROP TABLE "consolidated_expenses"`);
    }

}
