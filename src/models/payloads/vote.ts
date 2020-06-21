import { IFetchCandidatePayload, candidateToFetchPayload } from './candidate';
import { IFetchStudentPayload, studentToFetchPayload } from './student';
import { Vote } from '../entities/Vote';

export interface IFetchVotePayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly student: IFetchStudentPayload;
  readonly candidate: IFetchCandidatePayload;
}

export const voteToFetchPayload = (
  vote: Vote,
): IFetchVotePayload => {
  const {
    id,
    createdAt,
    student,
    candidate,
  } = vote;

  return {
    id,
    createdAt,
    candidate: candidateToFetchPayload(candidate),
    student: studentToFetchPayload(student),
  };
};
