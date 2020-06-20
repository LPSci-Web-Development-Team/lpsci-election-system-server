// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Payloads
import { ICreateStudentPayload } from '../../models/payloads/student';

// ANCHOR Entities
import { Student } from '../../models/entities/Student';
import { User } from '../../models/entities/User';

/**
 * ANCHOR: Get all students
 */
export const getAllStudents = async () => (
  getRepository(Student)
    .find({
      order: {
        currentGradeLevel: 'ASC',
      },
      relations: ['user'],
    })
);

/**
 * ANCHOR: Get a student by id
 * @param id Student's id
 */
export const getStudentById = async (
  id: string,
) => (
  getRepository(Student)
    .findOne({
      where: {
        id,
      },
      relations: ['user'],
    })
);

/**
 * ANCHOR: Create a student
 *
 * @param payload Create student payload
 * @param user Associated user
 */
export const createStudent = async (
  payload: ICreateStudentPayload,
  user: User,
) => {
  const { learnerReferenceNumber } = payload;

  const studentRepository = getRepository(Student);

  const newStudent = studentRepository
    .create({
      learnerReferenceNumber,
      user,
    });

  const student = await studentRepository
    .save(newStudent);

  return student;
};

/**
 * ANCHOR: Update student data
 *
 * @param payload Update student payload
 * @param currentStudent Current student
 */
export const updateStudent = async (
  payload: ICreateStudentPayload,
  currentStudent: Student,
) => {
  const { learnerReferenceNumber } = payload;

  const newStudent = currentStudent;
  newStudent.learnerReferenceNumber = learnerReferenceNumber;

  const student = await getRepository(Student)
    .save(newStudent);

  return student;
};
