import { IFetchCandidatePayload, candidateToFetchPayload } from './candidate';
import { Party } from '../entities/Party';

export interface ICreatePartyPayload {
  readonly name: string;
  readonly color: string;
}

export interface IFetchPartyPayload {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly candidates?: IFetchCandidatePayload[];
}

export const partyToFetchPayload = (
  party: Party,
): IFetchPartyPayload => {
  const {
    id,
    name,
    color,
    candidates,
  } = party;

  return {
    id,
    name,
    color,
    candidates: candidates && candidates.map(candidateToFetchPayload),
  };
};
