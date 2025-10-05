import { Module } from "@nestjs/common";
import { DeputiesController } from "./deputies.controller";
import { DeputiesService } from "./deputies.service";
import { ChamberModule } from "../chamber/chamber.module";

@Module({
    imports: [ChamberModule],
    controllers: [DeputiesController],
    providers: [DeputiesService],
    exports: [DeputiesService]
})
export class DeputiesModule { }