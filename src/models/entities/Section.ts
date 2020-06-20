// ANCHOR Typeorm
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany,
} from 'typeorm';

// ANCHOR Entities
import { TimestampedEntity } from './common/TimestampedEntity';
import { Student } from './Student';
import { SchoolYear } from './SchoolYear';

/* ANCHOR: Student entity --------------------------------------------------- */
@Entity()
export class Section extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @Column({})
  public gradeLevel!: string;

  @Column()
  public adviser!: string;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.sections)
  public schoolYear!: SchoolYear;

  @ManyToMany(() => Student, (student) => student.sections)
  public students!: Student;
}
