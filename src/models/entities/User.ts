// ANCHOR Typeorm
import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';

// ANCHOR Entities
import { TimestampedEntity } from './common/TimestampedEntity';
import { Student } from './Student';

// ANCHOR Payloads
import { Sex } from '../payloads/user';

/* ANCHOR: User entity ------------------------------------------------------ */
@Entity()
export class User extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryColumn()
  public id!: string;

  @Column()
  @Index()
  public email!: string;

  @Column()
  public firstName!: string;

  @Column({ nullable: true })
  public middleName?: string;

  @Column()
  public lastName!: string;

  @Column()
  public streetAddress!: string;

  @Column()
  public barangay!: string;

  @Column()
  public city!: string;

  @Column({ enum: Sex })
  public sex!: Sex;

  @Column()
  public birthDate!: Date;

  @Column({ nullable: true })
  public phoneNumber?: string;

  @Column({ nullable: true })
  public displayPhotoUuid?: string;

  @Column({ default: false })
  @Index()
  public isAdmin!: boolean;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @OneToOne(() => Student, (student) => student.user)
  public student!: Student;
}
