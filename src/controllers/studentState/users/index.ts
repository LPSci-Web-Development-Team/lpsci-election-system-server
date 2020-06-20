// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { StudentState } from '../../../models/entities/StudentState';

// ANCHOR Payload
import { EStudentState } from '../../../models/payloads/studentState';
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Get all users by student state and year
 */
export const getAllStudentByStudentStateAndYear = async (
  studentState: EStudentState,
  schoolYear: string,
) => {
  const state = await getRepository(StudentState)
    .findOne({
      where: {
        state: studentState,
        schoolYear,
      },
      relations: ['users'],
    });

  if (!state) {
    throw new NotFoundError(`${studentState} state with the school year of ${schoolYear} does not exist`);
  }

  return state.users;
};
