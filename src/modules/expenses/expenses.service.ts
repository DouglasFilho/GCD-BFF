import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ConsolidatedExpenses } from './consolidatedExpenses.entity';
import { IExpense } from '../deputies/deputies.interfaces';
import { ChamberService } from '../chamber/chamber.service';
import { Deputy } from '../deputies/deputy.entity';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly chamberService: ChamberService,
    @InjectRepository(ConsolidatedExpenses)
    private readonly expensesRepository: Repository<ConsolidatedExpenses>,
    @InjectRepository(Deputy)
    private readonly deputyRepository: Repository<Deputy>,
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

  async compare(deputyId: number, targetComparison: number) {
    let existingDeputyConsolidated = await this.expensesRepository.findOne({
      where: { deputy: { id: deputyId } },
    });

    let existingTargetConsolidated = await this.expensesRepository.findOne({
      where: { deputy: { id: targetComparison } },
    });

    const deputy = await this.deputyRepository.findOne({ where: { id: deputyId } });
    const targetDeputy = await this.deputyRepository.findOne({ where: { id: targetComparison } });

    if (!deputy || !targetDeputy) {
      throw new Error('Deputy not found for comparison');
    }

    if (!existingDeputyConsolidated) {
      const deputyExpenses = await this.chamberService.getDeputyExpenses(deputy.chamberApiId, { ano: 2025 });
      existingDeputyConsolidated = await this.createOrUpdateConsolidatedExpense(
        deputyId,
        this.filterExpensesData(deputyExpenses),
      );
    }

    if (!existingTargetConsolidated) {
      const targetExpenses = await this.chamberService.getDeputyExpenses(targetDeputy.chamberApiId, { ano: 2025 });
      existingTargetConsolidated = await this.createOrUpdateConsolidatedExpense(
        targetComparison,
        this.filterExpensesData(targetExpenses),
      );
    }

    return {
      deputyConsolidated: existingDeputyConsolidated,
      targetConsolidated: existingTargetConsolidated,
    };
  }

  
    private filterExpensesData(data: any): Array<IExpense> {
        if (data?.dados) {
            return data.dados.map((exp: any) => ({
                tipoDespesa: exp.tipoDespesa ?? exp.tipoDocumento,
                dataDocumento: exp.dataDocumento,
                valorDocumento: exp.valorDocumento,
                valorLiquido: exp.valorLiquido,
                nomeFornecedor: exp.nomeFornecedor ?? exp.fornecedor,
                cnpjCpfFornecedor: exp.cnpjCpfFornecedor ?? exp.cpfCnpjFornecedor
            }))
        }

        return [];
    }
}
