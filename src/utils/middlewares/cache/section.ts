// ANCHOR Redis
import { redisClient } from '../../../index';

// ANCHOR Errors
import { CodedError } from '../../../errors/custom/CodedError';
import { ErrorCode } from '../../../errors';

// ANCHOR Payloads
import { IFetchSectionPayload } from '../../../models/payloads/section';

/**
 * ANCHOR: Returns the cached section if there are any.
 *
 * @param ctxParamName URL parameter name
 */
export const getCacheSection = (
  ctxParamName: string,
) => (
  function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    redisClient.get(`section:${params}`, (error, result) => {
      if (error) {
        throw new CodedError(ErrorCode.BadRequest, error.message);
      }

      if (result) {
        ctx.state.cache.section = JSON.parse(result) as IFetchSectionPayload;
      }
    });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the section:${params} as key.
 * NOTE: Expires in five minutes
 *
 * @param payload Fetched section
 */
export const setCacheSection = (
  params: string,
  payload: IFetchSectionPayload,
) => {
  redisClient.setex(`section:${params}`, 300, JSON.stringify(payload));
};


/**
 * ANCHOR: Returns the cached section if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllSection = (
  ctx: any,
  next: () => Promise<void>,
) => {
  redisClient.get('section:all', (error, result) => {
    if (error) {
      throw new CodedError(ErrorCode.BadRequest, error.message);
    }

    if (result) {
      ctx.state.cache.sections = JSON.parse(result) as IFetchSectionPayload[];
    }
  });

  return next();
};

/**
 * ANCHOR: Sets a new cache in redis with the section:all as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched section
 */
export const setCacheAllSection = (
  payload: IFetchSectionPayload[],
) => {
  redisClient.setex('section:all', 3600, JSON.stringify(payload));
};
