// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Payloads
import { ICreateStudentStatePayload } from '../../models/payloads/studentState';

// ANCHOR Entities
import { StudentState } from '../../models/entities/StudentState';

/**
 * ANCHOR: Get all student states
 */
export const getAllStudentStates = async () => (
  getRepository(StudentState)
    .find({
      order: {
        schoolYear: 'ASC',
      },
    })
);

/**
 * ANCHOR: Get all student states by year
 */
export const getAllStudentStatesByYear = async (
  schoolYear: string,
) => (
  getRepository(StudentState)
    .find({
      where: {
        schoolYear,
      },
      order: {
        schoolYear: 'ASC',
      },
    })
);

/**
 * ANCHOR: Get a student state by id
 * @param id Student state's id
 */
export const getStudentStateById = async (
  id: string,
) => (
  getRepository(StudentState)
    .findOne({
      where: {
        id,
      },
    })
);

/**
 * ANCHOR: Create a student state
 *
 * @param payload Create student state payload
 */
export const createStudentState = async (
  payload: ICreateStudentStatePayload,
) => {
  const { state, schoolYear } = payload;

  const studentStateRepository = getRepository(StudentState);

  const newStudentState = studentStateRepository
    .create({
      state,
      schoolYear,
    });

  const studentState = await studentStateRepository
    .save(newStudentState);

  return studentState;
};

/**
 * ANCHOR: Delete student state
 *
 * @param currentStudent Current student
 */
export const deleteStudentState = async (
  currentStudentState: StudentState,
) => {
  await getRepository(StudentState).remove(currentStudentState);
};
