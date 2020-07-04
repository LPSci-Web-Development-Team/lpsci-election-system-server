// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { SchoolYear } from '../../../models/entities/SchoolYear';

// ANCHOR Error
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Get all sections
 *
 * @param schoolYear School Year
 */
export const getAllSectionsForSchoolYear = async (
  { id }: SchoolYear,
) => {
  const schoolYear = await getRepository(SchoolYear)
    .findOne({
      where: {
        id,
      },
      relations: ['sections'],
    });

  if (!schoolYear) {
    throw new NotFoundError(`School year with id of ${id} could not be found`);
  }

  return schoolYear.sections.sort((a, b) => Number(a.gradeLevel) - Number(b.gradeLevel));
};
