import { Module } from "@nestjs/common";
import { DeputiesController } from "./deputies.controller";
import { DeputiesService } from "./deputies.service";
import { ChamberModule } from "../chamber/chamber.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deputy } from "./deputy.entity";
import { ConsolidatedExpenses } from "../expenses/consolidatedExpenses.entity";
import { ExpensesService } from "../expenses/expenses.service";

@Module({
    imports: [ChamberModule, TypeOrmModule.forFeature([Deputy, ConsolidatedExpenses])],
    controllers: [DeputiesController],
    providers: [DeputiesService, ExpensesService],
    exports: [DeputiesService]
})
export class DeputiesModule { }
