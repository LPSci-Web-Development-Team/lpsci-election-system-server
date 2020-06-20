// ANCHOR Controller
import { getSchoolYearById } from '../../../controllers/schoolYear';

// ANCHOR Errors
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Set state school year from params middleware:
 * Fetches school year from context parameters given param name;
 * Returns middleware that injects fetched student in state;
 * Request will fail with a not found error if student cannot be found.
 *
 * @param ctxParamName URL parameter name for student ID
 */
export const setStateSchoolYearFromParams = (ctxParamName: string) => (
  async function setStateSchoolYear(ctx: any, next: () => Promise<any>) {
    const schoolYearId = ctx.params[ctxParamName];
    const schoolYear = await getSchoolYearById(schoolYearId);

    if (!schoolYear) {
      throw new NotFoundError(`School year with ID ${schoolYearId} could not be found`);
    }

    ctx.state.schoolYear = schoolYear;
    return next();
  }
);
