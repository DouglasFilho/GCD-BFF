import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ConsolidatedExpenses } from './consolidatedExpenses.entity';
import { IExpense } from '../deputies/deputies.interfaces';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ConsolidatedExpenses)
    private readonly expensesRepository: Repository<ConsolidatedExpenses>,
  ) {}

  findAll(): Promise<ConsolidatedExpenses[]> {
    return this.expensesRepository.find();
  }

  async findOne(deputyId: number): Promise<ConsolidatedExpenses | null> {
    return this.expensesRepository.findOne({
      where: { deputy: { id: deputyId } },
    });
  }

  async remove(id: number): Promise<void> {
    await this.expensesRepository.delete(id);
  }

  async createOrUpdateConsolidatedExpense(deputyId: number, expenses: IExpense[]) {
    const mostRecurringType: { type: string; quantity: number }[] = [];
    let expensesSum = 0;
    let expensesQuantity = 0;

    for (const expense of expenses) {
      expensesSum += expense.valorLiquido ?? 0;
      expensesQuantity++;
      const index = mostRecurringType.findIndex(t => t.type === expense.tipoDespesa);
      
      if (index > -1) {
        mostRecurringType[index].quantity++;
      } else {
        mostRecurringType.push({ type: expense.tipoDespesa, quantity: 1 })
      };
    }

    const monthsElapsed = new Date().getMonth() + 1;
    const averageMonthlyExpense = Number(((expensesSum || 0) / monthsElapsed).toFixed(2));

    const mostFrequent =
      mostRecurringType.length > 0
        ? mostRecurringType.reduce((max, cur) => (cur.quantity > max.quantity ? cur : max))
        : { type: 'N/A', quantity: 0 };

    const payload: DeepPartial<ConsolidatedExpenses> = {
      deputy: { id: deputyId } as any,
      expensesSum,
      expensesQuantity,
      averageMonthlyExpense,
      mostFrequentType: mostFrequent.type,
    };

    const existing = await this.expensesRepository.findOne({
      where: { deputy: { id: deputyId } },
    });

    if (existing) {
      const merged = this.expensesRepository.merge(existing, payload);
      return this.expensesRepository.save(merged);
    }

    const entity = this.expensesRepository.create(payload);
    return this.expensesRepository.save(entity);
  }
}
