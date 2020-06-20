// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { Section } from '../../../models/entities/Section';
import { SchoolYear } from '../../../models/entities/SchoolYear';

/**
 * ANCHOR: Get all sections
 *
 * @param schoolYear School Year
 */
export const getAllSections = async (
  schoolYear: SchoolYear,
) => (
  getRepository(Section)
    .createQueryBuilder('section')
    .innerJoinAndSelect('section.schoolYear', 'schoolYear')
    .where('schoolYear.id = :id', {
      id: schoolYear.id,
    })
    .getMany()
);
