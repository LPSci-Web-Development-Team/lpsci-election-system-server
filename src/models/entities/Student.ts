// ANCHOR Typeorm
import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne,
} from 'typeorm';

// ANCHOR Entities
import { User } from './User';
import { TimestampedEntity } from './common/TimestampedEntity';

/* ANCHOR: Student entity --------------------------------------------------- */
@Entity()
export class Student extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public learnerReferenceNumber!: string;

  @Column()
  public isEnrolled!: boolean;

  @Column({ nullable: true })
  public currentGradeLevel?: string;

  @Column({ nullable: true })
  public currentSection?: string;

  @Column({ nullable: true })
  public currentAdviser?: string;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @OneToOne(() => User, (user) => user.student)
  public user!: User;

  // TODO STUDENT ENTITY
  // Add proper types to section and grade level
  // Add relations
}
