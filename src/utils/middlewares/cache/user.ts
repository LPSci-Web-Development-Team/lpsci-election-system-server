// ANCHOR Utils
import { logger } from '../logger';

/**
 * ANCHOR: Cache a single user result middleware
 *
 * @param ctx Koa context
 * @param next Next middleware
 */
export const cacheSingleUser = (
  ctx: any,
  next: () => Promise<void>,
) => {
  logger.info(ctx, next);
};

/**
 * ANCHOR: Cache an array of user results middlware.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const cacheMultipleUser = (
  ctx: any,
  next: () => Promise<void>,
) => {
  logger.info(ctx, next);
};
