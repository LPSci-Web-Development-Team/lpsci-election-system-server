// ANCHOR Entities
import { StudentState } from '../entities/StudentState';

// ANCHOR Payload
import { IFetchUserPayload } from './user';

export enum EStudentState {
  Enrolled = 'enrolled',
  Dropped = 'dropped',
  Transfered = 'transfered',
  Graduated = 'graduated',
}

export interface ICreateStudentStatePayload {
  readonly state: EStudentState;
  readonly schoolYear: string;
}

export interface IFetchStudentStatePayload {
  readonly id: string;
  readonly state: EStudentState;
  readonly schoolYear: string;
  readonly users?: IFetchUserPayload[];
}

export const studentStateToFetchPayload = (
  studentState: StudentState,
) => {
  const {
    id,
    state,
    schoolYear,
    users,
  } = studentState;

  return {
    id,
    state,
    schoolYear,
    users,
  };
};
