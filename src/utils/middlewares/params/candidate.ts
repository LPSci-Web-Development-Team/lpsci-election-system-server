// ANCHOR Controller
import { getCandidateById } from '../../../controllers/candidate';

// ANCHOR Errors
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Set state candidate from params middleware:
 * Fetches candidate from context parameters given param name;
 * Returns middleware that injects fetched candidate in state;
 * Request will fail with a not found error if candidate cannot be found.
 *
 * @param ctxParamName URL parameter name for ca dkdate ID
 */
export const setStateCandidateFromParams = (ctxParamName: string) => (
  async function setStateCandidate(ctx: any, next: () => Promise<any>) {
    const candidateId = ctx.params[ctxParamName];
    const candidate = await getCandidateById(candidateId);

    if (!candidate) {
      throw new NotFoundError(`Candidate with ID ${candidateId} could not be found`);
    }

    ctx.state.candidate = candidate;
    return next();
  }
);
