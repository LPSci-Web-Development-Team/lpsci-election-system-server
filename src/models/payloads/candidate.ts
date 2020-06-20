import { IFetchStudentPayload, studentToFetchPayload } from './student';
import { Candidate } from '../entities/Candidate';

export enum EPosition {
  President = 'president',
  VicePresident = 'vicepresident',
  Secretary = 'secretary',
  Treasurer = 'treasurer',
  Auditor = 'auditor',
  PeaceOfficer = 'peaceofficer',
  PublicInformationOfficer = 'publicinformationofficer',
  GradeSevenLevelRepresentative = 'sevenlevelrep',
  GradeEightLevelRepresentative = 'eightlevelrep',
  GradeNineLevelRepresentative = 'ninelevelrep',
  GradeTenLevelRepresentative = 'tenlevelrep',
  GradeElevenLevelRepresentative = 'elevenlevelrep',
  GradeTwelveLevelRepresentative = 'twelvelevelrep',
}

export enum ECandidateState {
  Indeterminate = 'indeterminate',
  Winner = 'winner',
  Loser = 'loser',
}

export interface ICreateCandidatePayload {
  readonly position: EPosition;
}

export interface IFetchCandidatePayload {
  readonly id: string;
  readonly position: EPosition;
  readonly voteCount: number;
  readonly state: ECandidateState;
  readonly student: IFetchStudentPayload;
  // readonly party?: IFetchPartyPayload;
  // readonly votes?: IFetchVotePayload[];
}

export const candidateToFetchPayload = (
  candidate: Candidate,
): IFetchCandidatePayload => {
  const {
    id,
    position,
    voteCount,
    state,
    student,
    // party,
    // votes,
  } = candidate;

  return {
    id,
    position,
    voteCount,
    state,
    student: student && studentToFetchPayload(student),
  };
};
