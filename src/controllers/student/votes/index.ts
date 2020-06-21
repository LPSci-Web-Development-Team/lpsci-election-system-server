// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { Student } from '../../../models/entities/Student';

// ANCHOR Error
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Get all votes
 *
 * @param student Student
 */
export const getAllVotesForStudent = async (
  { id }: Student,
) => {
  const student = await getRepository(Student)
    .findOne({
      where: {
        id,
      },
      relations: ['votes'],
    });

  if (!student) {
    throw new NotFoundError(`Student with id of ${id} could not be found`);
  }

  return student.votes;
};
