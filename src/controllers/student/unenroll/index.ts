// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { Student } from '../../../models/entities/Student';

/**
 * ANCHOR: Get all not enrolled students
 */
export const getAllNotEnrolledStudents = async () => (
  getRepository(Student)
    .find({
      where: {
        isEnrolled: true,
      },
      relations: ['user'],
    })
);

/**
 * ANCHOR: Unenroll a student
 *
 * @param currentStudent Current student
 */
export const unenrollStudent = async (
  currentStudent: Student,
) => {
  if (!currentStudent.isEnrolled) {
    return currentStudent;
  }

  const newStudent = currentStudent;
  newStudent.isEnrolled = false;

  const student = await getRepository(Student)
    .save(newStudent);

  return student;
};
