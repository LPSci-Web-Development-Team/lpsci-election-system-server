// ANCHOR Controller
import { getUserById } from '../../../controllers/user';

// ANCHOR Errors
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Set state user from params middleware:
 * Fetches user ID from context parameters given param name;
 * Returns middleware that injects fetched user in state;
 * Request will fail with a not found error if user cannot be found.
 *
 * @param ctxParamName URL parameter name for user ID
 */
export const setStateUserFromParams = (ctxParamName: string) => (
  async function setStateUser(ctx: any, next: () => Promise<any>) {
    const userId = ctx.params[ctxParamName];
    const user = await getUserById(userId);

    if (!user) {
      throw new NotFoundError(`User with ID ${userId} could not be found`);
    }

    ctx.state.userParam = user;
    return next();
  }
);
