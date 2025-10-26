import { Module } from "@nestjs/common";
import { ExpensesController } from "./expenses.controller";
import { ExpensesService } from "./expenses.service";
import { ChamberModule } from "../chamber/chamber.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsolidatedExpenses } from "./consolidatedExpenses.entity";

@Module({
    imports: [ChamberModule, TypeOrmModule.forFeature([ConsolidatedExpenses])],
    controllers: [ExpensesController],
    providers: [ExpensesService],
    exports: [ExpensesService]
})
export class ExpensesModule { }