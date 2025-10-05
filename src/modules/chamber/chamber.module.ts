import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ChamberService } from "./chamber.service";
import { ChamberClient } from "./chamber.client";

@Module({
    imports: [HttpModule],
    providers: [ChamberService, ChamberClient],
    exports: [ChamberService]
})
export class ChamberModule { }