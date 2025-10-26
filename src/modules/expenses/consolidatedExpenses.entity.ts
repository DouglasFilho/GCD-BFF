import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Deputy } from '../deputies/deputy.entity';

@Entity()
export class ConsolidatedExpenses {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Deputy)
  @JoinColumn({ name: 'deputyId' })
  deputy: Deputy;

  @Column()
  mostFrequentType: string;

  @Column('numeric')
  expensesSum: number;

  @Column()
  expensesQuantity: number;

  @Column('numeric')
  averageMonthlyExpense: number;
}
