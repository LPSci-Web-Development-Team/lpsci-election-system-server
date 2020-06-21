// ANCHOR Typeorm
import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, OneToMany, getRepository,
} from 'typeorm';

// ANCHOR Entities
import { User } from './User';
import { Section } from './Section';
import { Vote } from './Vote';
import { Candidate } from './Candidate';
import { TimestampedEntity } from './common/TimestampedEntity';

// ANCHOR Payloads
import { EGrade } from '../payloads/section';
import { IStudentCurrentPayload } from '../payloads/student';

// ANCHOR Controllers
import { getAllSchoolYears } from '../../controllers/schoolYear';

/* ANCHOR: Student entity --------------------------------------------------- */
@Entity()
export class Student extends TimestampedEntity {
  /* ANCHOR: Fields --------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ unique: true })
  public learnerReferenceNumber!: string;

  public currentGradeLevel?: EGrade;

  public currentSection?: string;

  public currentAdviser?: string;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @OneToOne(() => User, (user) => user.student, {
    eager: true,
  })
  public user!: User;

  @ManyToMany(() => Section, (section) => section.students)
  public sections!: Section[];

  @OneToMany(() => Candidate, (candidate) => candidate.student)
  public candidates!: Candidate[];

  @OneToMany(() => Vote, (vote) => vote.student)
  public votes!: Vote[];

  /* ANCHOR: Functions ------------------------------------------------------ */
  public async loadCurrents(): Promise<IStudentCurrentPayload> {
    // Get this student
    const thisStudent = await getRepository(Student)
      .findOneOrFail({
        where: {
          id: this.id,
        },
        relations: ['sections', 'section.schoolYear'],
      });

    // Get school year entity
    const schoolYears = await getAllSchoolYears();
    const currentSchoolYearEntity = schoolYears[0];

    // Get section entity
    const currentSectionEntity = thisStudent.sections
      .find((section) => (
        section.schoolYear.id === currentSchoolYearEntity.id
      ));

    // Assign as it is supposed to do
    this.currentSection = currentSectionEntity?.name;
    this.currentGradeLevel = currentSectionEntity?.gradeLevel;
    this.currentAdviser = currentSectionEntity?.adviser;

    // Return because why not
    return {
      currentAdviser: this.currentAdviser,
      currentGradeLevel: this.currentGradeLevel,
      currentSection: this.currentSection,
    };
  }
}
