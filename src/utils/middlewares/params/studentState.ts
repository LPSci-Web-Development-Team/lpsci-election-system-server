// ANCHOR Controller
import { getStudentStateById } from '../../../controllers/studentState';

// ANCHOR Errors
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Set state student state from params middleware:
 * Fetches student state from context parameters given param name;
 * Returns middleware that injects fetched student in state;
 * Request will fail with a not found error if student cannot be found.
 *
 * @param ctxParamName URL parameter name for student ID
 */
export const setStateStudentStateFromParams = (ctxParamName: string) => (
  async function setStateStudentState(ctx: any, next: () => Promise<any>) {
    const studentStateId = ctx.params[ctxParamName];
    const studentState = await getStudentStateById(studentStateId);

    if (!studentState) {
      throw new NotFoundError(`Student state with ID ${studentStateId} could not be found`);
    }

    ctx.state.studentState = studentState;
    return next();
  }
);
