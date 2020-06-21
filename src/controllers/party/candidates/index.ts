// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { Party } from '../../../models/entities/Party';

// ANCHOR Error
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Get all candidates
 *
 * @param party Party
 */
export const getAllCandidatesForParty = async (
  { id }: Party,
) => {
  const party = await getRepository(Party)
    .findOne({
      where: {
        id,
      },
      relations: ['candidates'],
    });

  if (!party) {
    throw new NotFoundError(`Party with id of ${id} could not be found`);
  }

  return party.candidates;
};
