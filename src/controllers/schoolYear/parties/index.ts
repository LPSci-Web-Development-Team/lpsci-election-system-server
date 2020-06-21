// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { SchoolYear } from '../../../models/entities/SchoolYear';

// ANCHOR Error
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Get all parties
 *
 * @param schoolYear School Year
 */
export const getAllPartiesForSchoolYear = async (
  { id }: SchoolYear,
) => {
  const schoolYear = await getRepository(SchoolYear)
    .findOne({
      where: {
        id,
      },
      relations: ['parties'],
    });

  if (!schoolYear) {
    throw new NotFoundError(`Party with id of ${id} could not be found`);
  }

  return schoolYear.parties;
};
