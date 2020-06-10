// ANCHOR Utils
import { logger } from '../logger';

// ANCHOR Controllers
import { getUserFromAuthToken } from '../../controllers/user/utils/getUserFromAuthToken';

// ANCHOR Errors
import { CodedError } from '../../errors/custom/CodedError';
import { ErrorCode } from '../../errors';
import { AuthorizationError } from '../../errors/custom/AuthorizationError';

/**
 * ANCHOR: Get auth token
 * Finds the auth token in request object
 *
 * @param ctx Koa Context
 */
const getAuthToken = (
  ctx: any,
) => {
  const { authorization } = ctx.headers;

  const hasBearerToken = authorization
    && authorization.split(' ')[0] === 'Bearer';

  return hasBearerToken
    ? authorization.split(' ')[1]
    : undefined;
};

/**
 * ANCHOR: Set state user middleware
 * Puts the current signed in user in Koa state store
 *
 * @param ctx Koa context
 * @param next Next middleware
 */
export const setStateUser = async (
  ctx: any,
  next: () => Promise<any>,
) => {
  const authToken = getAuthToken(ctx);

  if (!authToken) {
    return next();
  }

  await getUserFromAuthToken(authToken)
    .then((user) => {
      ctx.state.user = user;
    })
    .catch((error) => {
      logger.info(`Attempted to set state user when unauthenticated, received ${authToken}`);
      logger.error(error);
    });

  return next();
};

/**
 * ANCHOR: Assert context has user
 * Throws an unauthenticated coded error if user is not found in context state
 * @param ctx
 */
const assertContextHasUser = (ctx: any) => {
  if (!ctx.state.user) {
    throw new CodedError(
      ErrorCode.Unauthenticated,
      'This endpoint requires authentication',
    );
  }
};

/**
 * ANCHOR: Require sign in middleware
 * Throws an unauthenticated error when user is not found
 * in context state and does not process next middleware
 *
 * @param ctx Koa context
 * @param next Next middleware
 */
export const requireSignIn = (
  ctx: any,
  next: () => Promise<void>,
) => {
  assertContextHasUser(ctx);
  return next();
};

/**
 * ANCHOR: Require admin middleware
 * Throws an unauthenticated error when user is not in
 * context state
 * Throws an unauthorized error when user is not an admin
 *
 * @param ctx Koa context
 * @param next Next middleware
 */
export const requireAdmin = (
  ctx: any,
  next: () => Promise<void>,
) => {
  assertContextHasUser(ctx);

  const { user } = ctx.state;

  if (!user.isAdmin) {
    throw new AuthorizationError();
  }

  return next();
};
