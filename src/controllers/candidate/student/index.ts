// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Payloads
import { ICreateCandidatePayload } from '../../../models/payloads/candidate';

// ANCHOR Entities
import { Candidate } from '../../../models/entities/Candidate';
import { Student } from '../../../models/entities/Student';

/**
 * ANCHOR: Create a candidate
 *
 * @param payload Create candidate payload
 */
export const createCandidate = async (
  payload: ICreateCandidatePayload,
  student: Student,
) => {
  const { position } = payload;

  const candidateRepository = getRepository(Candidate);

  const newCandidate = candidateRepository
    .create({
      position,
      student,
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
  currentCandidate: Candidate,
) => {
  const { position } = payload;

  const newCandidate = currentCandidate;
  newCandidate.position = position;
  newCandidate.student = student;

  const candidate = await getRepository(Candidate)
    .save(newCandidate);

  return candidate;
};
