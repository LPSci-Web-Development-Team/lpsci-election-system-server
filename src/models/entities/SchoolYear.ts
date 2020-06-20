// ANCHOR Typeorm
import {
  Entity, PrimaryGeneratedColumn, Column,
} from 'typeorm';

// ANCHOR Entities
import { TimestampedEntity } from './common/TimestampedEntity';

/* ANCHOR: School Year entity --------------------------------------------------- */
@Entity()
export class SchoolYear extends TimestampedEntity {
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
