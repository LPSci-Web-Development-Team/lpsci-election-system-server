// ANCHOR Typeorm
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';

// ANCHOR Entities
import { TimestampedEntity } from './common/TimestampedEntity';
import { Student } from './Student';

// ANCHOR Payloads
import { EPosition } from '../payloads/candidate';

/* ANCHOR: Student entity --------------------------------------------------- */
@Entity()
export class Candidate extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ enum: EPosition })
  public position!: EPosition;

  @Column()
  public voteCount!: number;

  @Column()
  public isWinner!: boolean;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @ManyToOne(() => Student, (student) => student.candidates)
  public student!: Student;

  // @ManyToOne(() => Party, (party) => party.candidates)
  // public party!: Party;

  // @OneToMany(() => Vote, (vote) => vote.candidate)
  // public votes!: Vote[];
}
