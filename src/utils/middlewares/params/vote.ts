// ANCHOR Controller
import { getVoteById } from '../../../controllers/vote';

// ANCHOR Errors
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Set state vote from params middleware:
 * Fetches vote ID from context parameters given param name;
 * Returns middleware that injects fetched vote in state;
 * Request will fail with a not found error if vote cannot be found.
 *
 * @param ctxParamName URL parameter name for vote ID
 */
export const setStateVoteFromParams = (ctxParamName: string) => (
  async function setStateVote(ctx: any, next: () => Promise<any>) {
    const voteId = ctx.params[ctxParamName];
    const vote = await getVoteById(voteId);

    if (!vote) {
      throw new NotFoundError(`Vote with ID ${voteId} could not be found`);
    }

    ctx.state.vote = vote;
    return next();
  }
);
