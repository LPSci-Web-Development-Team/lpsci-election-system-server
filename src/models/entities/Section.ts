// ANCHOR Typeorm
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable,
} from 'typeorm';

// ANCHOR Entities
import { TimestampedEntity } from './common/TimestampedEntity';
import { Student } from './Student';
import { SchoolYear } from './SchoolYear';

// ANCHOR Payloads
import { EGrade } from '../payloads/section';

/* ANCHOR: Student entity --------------------------------------------------- */
@Entity()
export class Section extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @Column({ enum: EGrade })
  public gradeLevel!: EGrade;

  @Column()
  public adviser!: string;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.sections)
  public schoolYear!: SchoolYear;

  @ManyToMany(() => Student, (student) => student.sections)
  @JoinTable()
  public students!: Student[];
}
