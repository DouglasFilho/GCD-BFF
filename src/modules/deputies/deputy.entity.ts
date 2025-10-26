
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Deputy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chamberApiId: number;

  @Column()
  name: string;

  @Column()
  partyAcronym: string;

  @Column()
  stateAcronym: string;

  @Column()
  photoUrl: string;
}
