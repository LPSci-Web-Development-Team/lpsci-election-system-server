// ANCHOR Controller
import { getSectionById } from '../../../controllers/section';

// ANCHOR Errors
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Set state section from params middleware:
 * Fetches section ID from context parameters given param name;
 * Returns middleware that injects fetched section in state;
 * Request will fail with a not found error if section cannot be found.
 *
 * @param ctxParamName URL parameter name for section ID
 */
export const setStateSectionFromParams = (ctxParamName: string) => (
  async function setStateSection(ctx: any, next: () => Promise<any>) {
    const sectionId = ctx.params[ctxParamName];
    const section = await getSectionById(sectionId);

    if (!section) {
      throw new NotFoundError(`Section with ID ${sectionId} could not be found`);
    }

    ctx.state.section = section;
    return next();
  }
);
