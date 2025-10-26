import { Controller, Get, Param, Post } from "@nestjs/common";
import { ExpensesService } from "./expenses.service";

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @Get()
    async list() {
        const response = await this.expensesService.findAll()
        return { response }
    }

    @Get(':id')
    async show(@Param() params: { deputyId: number }) {
        const response = await this.expensesService.findOne(params.deputyId)
        return { response }
    }
}
