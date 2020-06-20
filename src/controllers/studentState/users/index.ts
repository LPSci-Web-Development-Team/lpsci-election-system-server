// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { StudentState } from '../../../models/entities/StudentState';

// ANCHOR Payload
import { EStudentState } from '../../../models/payloads/studentState';
import { NotFoundError } from '../../../errors/custom/NotFound';
import { User } from '../../../models/entities/User';

/**
 * ANCHOR: Get all users by student state and year
 *
 * @param studentState Student state
 * @param schoolYear School year
 */
export const getAllStudentForStudentState = async (
  studentState: StudentState,
) => {
  const state = await getRepository(StudentState)
    .findOne({
      where: {
        id: studentState.id,
      },
      relations: ['users'],
    });

  if (!state) {
    throw new NotFoundError(`Student state with id of ${studentState.id} does not exist`);
  }

  return state.users;
};

/**
 * ANCHOR: Associate user to a student state (enroll, graduate,
 * etc.)
 *
 * @param user User
 * @param studentState Student state
 */
export const associateUserToStudentState = async (
  user: User,
  studentState: StudentState,
) => {
  const newStudentState = studentState;
  newStudentState.users = [user];

  return getRepository(StudentState).save(newStudentState);
};

/**
 * ANCHOR: Dissociate user from a student state
 *
 * @param user User
 * @param studentState Student state
 */
export const dissociateUserFromStudentState = async (
  user: User,
  studentState: StudentState,
) => {
  const newStudentState = studentState;

  newStudentState.users = newStudentState.users.filter((u) => (
    u.id !== user.id
  ));

  return getRepository(StudentState).save(newStudentState);
};
