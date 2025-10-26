import { Module } from "@nestjs/common";
import { DeputiesController } from "./deputies.controller";
import { DeputiesService } from "./deputies.service";
import { ChamberModule } from "../chamber/chamber.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deputy } from "./deputy.entity";

@Module({
    imports: [ChamberModule, TypeOrmModule.forFeature([Deputy])],
    controllers: [DeputiesController],
    providers: [DeputiesService],
    exports: [DeputiesService]
})
export class DeputiesModule { }