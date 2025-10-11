import { Controller, Get, Param } from "@nestjs/common";
import { DeputiesService } from "./deputies.service";

@Controller('deputies')
export class DeputiesController {
    constructor(private readonly deputiesService: DeputiesService) { }

    @Get()
    async list() {
        const response = await this.deputiesService.getFilteredDeputies()
        return { response }
    }

    @Get(':id')
    async show(@Param() params: { id: string }) {
        const response = await this.deputiesService.getFilteredDeputyInfo(params.id)
        return { response }
    }
}
