// ANCHOR Typeorm
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';

// ANCHOR Entities
import { TimestampedEntity } from './common/TimestampedEntity';
import { Student } from './Student';

// ANCHOR Payloads
import { EPosition, ECandidateState } from '../payloads/candidate';

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

  @Column({
    enum: ECandidateState,
    default: ECandidateState.Indeterminate,
  })
  public state!: ECandidateState;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @ManyToOne(() => Student, (student) => student.candidates, {
    eager: true,
  })
  public student!: Student;

  // @ManyToOne(() => Party, (party) => party.candidates)
  // public party!: Party;

  // @OneToMany(() => Vote, (vote) => vote.candidate)
  // public votes!: Vote[];
}
