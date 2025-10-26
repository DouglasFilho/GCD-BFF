import { Module } from "@nestjs/common";
import { ExpensesController } from "./expenses.controller";
import { ExpensesService } from "./expenses.service";
import { ChamberModule } from "../chamber/chamber.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsolidatedExpenses } from "./consolidatedExpenses.entity";
import { Deputy } from "../deputies/deputy.entity";

@Module({
    imports: [ChamberModule, TypeOrmModule.forFeature([ConsolidatedExpenses, Deputy])],
    controllers: [ExpensesController],
    providers: [ExpensesService],
    exports: [ExpensesService]
})
export class ExpensesModule { }
