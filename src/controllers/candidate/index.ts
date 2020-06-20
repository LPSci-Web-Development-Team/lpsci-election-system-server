// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Payloads
import { EPosition, ECandidateState } from '../../models/payloads/candidate';

// ANCHOR Entities
import { Candidate } from '../../models/entities/Candidate';

/**
 * ANCHOR: Get all candidates
 */
export const getAllCandidates = async () => (
  getRepository(Candidate)
    .find({
      order: {
        position: 'ASC',
      },
    })
);

/**
 * ANCHOR: Get all candidates by position
 */
export const getAllCandidatesByPosition = async (
  position: EPosition,
) => (
  getRepository(Candidate)
    .find({
      where: {
        position,
      },
    })
);

/**
* ANCHOR: Get all candidates by state
*/
export const getAllCandidatesByState = async (
  state: ECandidateState,
) => (
  getRepository(Candidate)
    .find({
      where: {
        state,
      },
    })
);

/**
 * ANCHOR: Get a candidate by id
 * @param id Candidate's id
 */
export const getCandidateById = async (
  id: string,
) => (
  getRepository(Candidate)
    .findOne({
      where: {
        id,
      },
    })
);

/**
 * ANCHOR: Delete candidate
 *
 * @param currentCandidate Current candidate
 */
export const deleteCandidate = async (
  currentCandidate: Candidate,
) => {
  await getRepository(Candidate).remove(currentCandidate);
};
