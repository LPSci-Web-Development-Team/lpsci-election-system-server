import { Section } from '../entities/Section';
import { IFetchStudentPayload, studentToFetchPayload } from './student';

export enum EGrade {
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Eleven = '11',
  Twelve = '12',
}

export interface ICreateSectionPayload {
  readonly name: string;
  readonly gradeLevel: EGrade;
  readonly adviser: string;
}

export interface IFetchSectionPayload {
  readonly id: string;
  readonly name: string;
  readonly gradeLevel: EGrade;
  readonly adviser: string;
  readonly students?: IFetchStudentPayload[];
}

export const sectionToFetchPayload = (
  section: Section,
): IFetchSectionPayload => {
  const {
    id,
    name,
    gradeLevel,
    adviser,
    students,
  } = section;

  return {
    id,
    name,
    gradeLevel,
    adviser,
    students: students && students.map(studentToFetchPayload),
  };
};
