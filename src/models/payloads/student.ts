// ANCHOR Entities
import { Student } from '../entities/Student';

// ANCHOR Payloads
import { IFetchUserPayload, userToFetchPayload } from './user';
import { EGrade } from './section';

/* ANCHOR: Sign Up Payload -------------------------------------------------- */
export interface ICreateStudentPayload {
  readonly learnerReferenceNumber: string;
}

export interface IStudentCurrentPayload {
  readonly currentAdviser?: string;
  readonly currentGradeLevel?: EGrade;
  readonly currentSection?: string;
}

/* ANCHOR: Fetch Student Payload ----------------------------------------------- */
export interface IFetchStudentPayload extends IStudentCurrentPayload {
  readonly id: string;
  readonly learnerReferenceNumber: string;
  readonly user?: IFetchUserPayload;
}

/* ANCHOR: Update Student Payload ---------------------------------------------- */
export interface IUpdateStudentPayload {
  readonly learnerReferenceNumber: string;
  readonly user?: IFetchUserPayload;
}

/**
 * ANCHOR: Student to fetch payload
 * @param student Student entity
 */
export const studentToFetchPayload = (
  student: Student,
): IFetchStudentPayload => {
  const {
    id,
    learnerReferenceNumber,
    currentAdviser,
    currentGradeLevel,
    currentSection,
    user,
  } = student;

  return {
    id,
    learnerReferenceNumber,
    currentAdviser,
    currentGradeLevel,
    currentSection,
    user: user && userToFetchPayload(user),
  };
};
