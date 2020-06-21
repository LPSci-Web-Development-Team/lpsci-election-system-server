// ANCHOR Typeorm
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, getRepository,
} from 'typeorm';

// ANCHOR Entities
import { TimestampedEntity } from './common/TimestampedEntity';
import { Student } from './Student';
import { Party } from './Party';
import { Vote } from './Vote';

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

  @ManyToOne(() => Party, (party) => party.candidates)
  public party!: Party;

  @OneToMany(() => Vote, (vote) => vote.candidate)
  public votes!: Vote[];

  /* ANCHOR: Functions ------------------------------------------------------ */
  public async loadCurrents(): Promise<number> {
    const thisCandidate = await getRepository(Candidate)
      .findOneOrFail({
        where: {
          id: this.id,
        },
        relations: ['votes'],
      });

    this.voteCount = thisCandidate.votes.length;

    return this.voteCount;
  }
}
