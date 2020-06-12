// ANCHOR Entities
import { Student } from '../entities/Student';

// ANCHOR Payloads
import { IFetchUserPayload } from './user';

/* ANCHOR: Sign Up Payload -------------------------------------------------- */
export interface ICreateStudentPayload {
  readonly learnerReferenceNumber: string;
}

/* ANCHOR: Fetch Student Payload ----------------------------------------------- */
export interface IFetchStudentPayload {
  readonly id: string;
  readonly learnerReferenceNumber: string;
  readonly currentAdviser?: string;
  readonly currentGradeLevel?: string;
  readonly currentSection?: string;
  readonly isEnrolled?: boolean;
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
    isEnrolled,
    user,
  } = student;

  return {
    id,
    learnerReferenceNumber,
    currentAdviser,
    currentGradeLevel,
    currentSection,
    isEnrolled,
    user,
  };
};
