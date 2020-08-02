// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Payloads
import { ICreateCandidatePayload } from '../../../models/payloads/candidate';

// ANCHOR Entities
import { Candidate } from '../../../models/entities/Candidate';
import { Student } from '../../../models/entities/Student';
import { Party } from '../../../models/entities/Party';

/**
 * ANCHOR: Create a candidate
 *
 * @param payload Create candidate payload
 */
export const createCandidate = async (
  payload: ICreateCandidatePayload,
  student: Student,
  party: Party,
) => {
  const { position } = payload;

  const candidateRepository = getRepository(Candidate);

  const newCandidate = candidateRepository
    .create({
      position,
      student,
      party,
    });

  const candidate = await candidateRepository
    .save(newCandidate);

  return candidate;
};

/**
 * ANCHOR: Update a candidate
 *
 * @param payload Update candidate payload
 */
export const updateCandidate = async (
  payload: ICreateCandidatePayload,
  student: Student,
  party: Party,
  currentCandidate: Candidate,
) => {
  const { position } = payload;

  const newCandidate = currentCandidate;
  newCandidate.position = position;
  newCandidate.student = student;
  newCandidate.party = party;

  const candidate = await getRepository(Candidate)
    .save(newCandidate);

  return candidate;
};
