import {
  Entity, Column, ManyToMany, PrimaryGeneratedColumn, JoinTable,
} from 'typeorm';
// ANCHOR Typeorm

// ANCHOR Payload
import { EStudentState } from '../payloads/studentState';

// ANCHOR Entities
import { User } from './User';
import { TimestampedEntity } from './common/TimestampedEntity';

/* ANCHOR: Student entity --------------------------------------------------- */
@Entity()
export class StudentState extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ enum: EStudentState })
  public state!: EStudentState;

  @Column()
  public schoolYear!: string;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @ManyToMany(() => User, (user) => user.states)
  @JoinTable()
  public users!: User[];
}
