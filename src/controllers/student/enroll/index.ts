// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { Student } from '../../../models/entities/Student';

/**
 * ANCHOR: Get all enrolled students
 */
export const getAllEnrolledStudents = async () => (
  getRepository(Student)
    .find({
      where: {
        isEnrolled: true,
      },
      relations: ['user'],
    })
);

/**
 * ANCHOR: Enroll a student
 *
 * @param currentStudent Current student
 */
export const enrollStudent = async (
  currentStudent: Student,
) => {
  if (currentStudent.isEnrolled) {
    return currentStudent;
  }

  const newStudent = currentStudent;
  newStudent.isEnrolled = true;

  const student = await getRepository(Student)
    .save(newStudent);

  return student;
};
