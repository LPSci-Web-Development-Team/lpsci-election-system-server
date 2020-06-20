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
  state: EStudentState;
  schoolYear: string;
}

export interface IFetchStudentStatePayload {
  id: string;
  state: EStudentState;
  schoolYear: string;
  users?: IFetchUserPayload[];
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
