import { Controller, Get, Param } from "@nestjs/common";
import { ChamberService } from "../chamber/chamber.service";

@Controller('deputies')
export class DeputiesController {
    constructor(private readonly chamberService: ChamberService) { }

    @Get()
    async list() {
        const deputiesResponse = await this.chamberService.getDeputies()
        return { deputiesResponse }
    }

    @Get(':id')
    async show(@Param() params: { id: string }) {
        const deputies = await this.chamberService.getDeputieInfo(params)
        return { deputies }
    }
}
