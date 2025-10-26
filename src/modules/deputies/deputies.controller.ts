import { Controller, Get, Param, Post, ParseIntPipe } from "@nestjs/common";
import { DeputiesService } from "./deputies.service";

@Controller('deputies')
export class DeputiesController {
    constructor(private readonly deputiesService: DeputiesService) { }

    @Get()
    async list() {
        const response = await this.deputiesService.findAll()
        return { response }
    }

    @Get(':id')
    async show(@Param('id', ParseIntPipe) id: number) {
        const response = await this.deputiesService.getFilteredDeputyInfo(id)
        return { response }
    }

    @Post('updateDeputies')
    async updateDeputies() {
        const response = await this.deputiesService.updateDeputies();
        return { response }
    }
}
