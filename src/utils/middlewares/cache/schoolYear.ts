// ANCHOR Redis
import { redisClient } from '../../../index';

// ANCHOR Errors
import { CodedError } from '../../../errors/custom/CodedError';
import { ErrorCode } from '../../../errors';

// ANCHOR Payloads
import { IFetchSchoolYearPayload } from '../../../models/payloads/schoolYear';

/**
 * ANCHOR: Returns the cached schoolYear if there are any.
 *
 * @param ctxParamName URL parameter name
 */
export const getCacheSchoolYear = (
  ctxParamName: string,
) => (
  function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    redisClient.get(`school-year:${params}`, (error, result) => {
      if (error) {
        throw new CodedError(ErrorCode.BadRequest, error.message);
      }

      if (result) {
        ctx.state.cache.schoolYear = JSON.parse(result) as IFetchSchoolYearPayload;
      }
    });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the school-year:${params} as key.
 * NOTE: Expires in five minutes
 *
 * @param payload Fetched schoolYear
 */
export const setCacheSchoolYear = (
  params: string,
  payload: IFetchSchoolYearPayload,
) => {
  redisClient.setex(`school-year:${params}`, 300, JSON.stringify(payload));
};


/**
 * ANCHOR: Returns the cached schoolYear if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllSchoolYear = (
  ctx: any,
  next: () => Promise<void>,
) => {
  redisClient.get('school-year:all', (error, result) => {
    if (error) {
      throw new CodedError(ErrorCode.BadRequest, error.message);
    }

    if (result) {
      ctx.state.cache.schoolYears = JSON.parse(result) as IFetchSchoolYearPayload[];
    }
  });

  return next();
};

/**
 * ANCHOR: Sets a new cache in redis with the school-year:all as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched schoolYear
 */
export const setCacheAllSchoolYear = (
  payload: IFetchSchoolYearPayload[],
) => {
  redisClient.setex('school-year:all', 3600, JSON.stringify(payload));
};
