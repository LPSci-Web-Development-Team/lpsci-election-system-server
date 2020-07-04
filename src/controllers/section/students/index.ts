// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { Section } from '../../../models/entities/Section';

// ANCHOR Payload
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Get all students of a specific question
 *
 * @param section Section
 */
export const getAllStudentForSection = async (
  { id }: Section,
) => {
  const section = await getRepository(Section)
    .findOne({
      where: {
        id,
      },
      join: {
        alias: 'section',
        leftJoinAndSelect: {
          students: 'section.students',
        },
      },
    });

  if (!section) {
    throw new NotFoundError(`Section with id of ${id} does not exist`);
  }

  return section.students;
};
