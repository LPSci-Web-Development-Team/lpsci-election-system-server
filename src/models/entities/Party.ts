import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
} from 'typeorm';
import { SchoolYear } from './SchoolYear';
// ANCHOR Typeorm

// ANCHOR Entities
import { TimestampedEntity } from './common/TimestampedEntity';
import { Candidate } from './Candidate';

/* ANCHOR: Student entity --------------------------------------------------- */
@Entity()
export class Party extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @Column()
  public color!: string;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @OneToMany(() => Candidate, (candidates) => candidates.party)
  public candidates!: Candidate[];

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.parties)
  public schoolYear!: SchoolYear;
}
