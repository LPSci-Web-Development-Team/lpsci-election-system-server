// ANCHOR Typeorm
import {
  Entity, PrimaryGeneratedColumn, Column,
} from 'typeorm';

// ANCHOR Entities
import { TimestampedEntity } from './common/TimestampedEntity';

/* ANCHOR: Student entity --------------------------------------------------- */
@Entity()
export class Student extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ unique: true })
  public year!: string;

  /* ANCHOR: Relations ------------------------------------------------------ */
  // @OneToMany(() => Section, (section) => section.schoolYear)
  // public sections!: Section[];

  // @OneToMany(() => Party, (party) => party.schoolYear)
  // public parties!: Party[];
}
