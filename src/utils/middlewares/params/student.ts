// ANCHOR Controller
import { getStudentById } from '../../../controllers/student';

// ANCHOR Errors
import { NotFoundError } from '../../../errors/custom/NotFound';
import { AuthorizationError } from '../../../errors/custom/AuthorizationError';

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

/**
 * ANCHOR: Require student to be enrolled
 * NOTE: Requires student to be in state
 *
 * @param ctx Koa context with state required
 * @param next Next middleware
 */
export async function requireStudentEnrolled(
  ctx: any,
  next: () => Promise<any>,
) {
  const { student } = ctx.state;

  if (!student.isEnrolled) {
    throw new AuthorizationError(
      'Student is not authorized to perform operations on this',
    );
  }

  return next();
}
