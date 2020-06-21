import {
  Entity, PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import { Candidate } from './Candidate';
// ANCHOR Typeorm

// ANCHOR Entities
import { Student } from './Student';
import { TimestampedEntity } from './common/TimestampedEntity';

/* ANCHOR: Vote entity --------------------------------------------------- */
@Entity()
export class Vote extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @ManyToOne(() => Student, (student) => student.votes)
  public student!: Student;

  @ManyToOne(() => Candidate, (candidate) => candidate.votes)
  public candidate!: Candidate;
}
