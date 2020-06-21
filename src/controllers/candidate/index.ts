// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Payloads
import { EPosition, ECandidateState } from '../../models/payloads/candidate';

// ANCHOR Entities
import { Candidate } from '../../models/entities/Candidate';

/* ANCHOR: Load vote count field --------------------------------------- */
export async function loadCandidateVoteCountField(
  candidate: Candidate,
): Promise<Candidate> {
  await Promise.all([
    (await candidate.loadCurrents()),
  ]);
  return candidate;
}

/**
 * ANCHOR: Get all candidates
 */
export const getAllCandidates = async () => {
  const candidates = await getRepository(Candidate)
    .find({
      order: {
        position: 'ASC',
      },
    });

  return Promise.all(candidates.map(async (candidate) => {
    await loadCandidateVoteCountField(candidate);

    return candidate;
  }));
};

/**
 * ANCHOR: Get all candidates by position
 */
export const getAllCandidatesByPosition = async (
  position: EPosition,
) => {
  const candidates = await getRepository(Candidate)
    .find({
      where: {
        position,
      },
    });

  return Promise.all(candidates.map(async (candidate) => {
    await loadCandidateVoteCountField(candidate);

    return candidate;
  }));
};

/**
* ANCHOR: Get all candidates by state
*/
export const getAllCandidatesByState = async (
  state: ECandidateState,
) => {
  const candidates = await getRepository(Candidate)
    .find({
      where: {
        state,
      },
    });

  return Promise.all(candidates.map(async (candidate) => {
    await loadCandidateVoteCountField(candidate);

    return candidate;
  }));
};

/**
 * ANCHOR: Get a candidate by id
 * @param id Candidate's id
 */
export const getCandidateById = async (
  id: string,
) => {
  const candidate = await getRepository(Candidate)
    .findOne({
      where: {
        id,
      },
    });

  if (candidate) {
    await loadCandidateVoteCountField(candidate);
  }

  return candidate;
};

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
