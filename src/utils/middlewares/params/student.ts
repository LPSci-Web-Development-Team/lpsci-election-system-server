// ANCHOR Controller
import { getStudentById } from '../../../controllers/student';

// ANCHOR Errors
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Set state student from params middleware:
 * Fetches student ID from context parameters given param name;
 * Returns middleware that injects fetched student in state;
 * Request will fail with a not found error if student cannot be found.
 *
 * @param ctxParamName URL parameter name for student ID
 */
export const setStateStudentFromParams = (ctxParamName: string) => (
  async function setStateStudent(ctx: any, next: () => Promise<any>) {
    const studentId = ctx.params[ctxParamName];
    const student = await getStudentById(studentId);

    if (!student) {
      throw new NotFoundError(`Student with ID ${studentId} could not be found`);
    }

    ctx.state.student = student;
    return next();
  }
);
