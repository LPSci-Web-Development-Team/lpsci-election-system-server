// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { Candidate } from '../../../models/entities/Candidate';

// ANCHOR Error
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Get all votes
 *
 * @param candidate Candidate
 */
export const getAllVotesForCandidate = async (
  { id }: Candidate,
) => {
  const candidate = await getRepository(Candidate)
    .findOne({
      where: {
        id,
      },
      relations: ['votes'],
    });

  if (!candidate) {
    throw new NotFoundError(`Candidate with id of ${id} could not be found`);
  }

  return candidate.votes;
};
