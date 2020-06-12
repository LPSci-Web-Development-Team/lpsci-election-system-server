// ANCHOR Redis
import { redisClient } from '../../../index';

// ANCHOR Errors
import { CodedError } from '../../../errors/custom/CodedError';
import { ErrorCode } from '../../../errors';

// ANCHOR Payloads
import { IFetchStudentPayload } from '../../../models/payloads/student';

/**
 * ANCHOR: Returns the cached student if there are any.
 *
 * @param ctxParamName URL parameter name
 */
export const getCacheStudent = (
  ctxParamName: string,
) => (
  function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    redisClient.get(`student:${params}`, (error, result) => {
      if (error) {
        throw new CodedError(ErrorCode.BadRequest, error.message);
      }

      if (result) {
        ctx.state.cache.student = JSON.parse(result) as IFetchStudentPayload;
      }
    });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the student:${params} as key.
 * NOTE: Expires in five minutes
 *
 * @param payload Fetched student
 */
export const setCacheStudent = (
  params: string,
  payload: IFetchStudentPayload,
) => {
  redisClient.setex(`student:${params}`, 300, JSON.stringify(payload));
};


/**
 * ANCHOR: Returns the cached student if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllStudent = (
  ctx: any,
  next: () => Promise<void>,
) => {
  redisClient.get('student:all', (error, result) => {
    if (error) {
      throw new CodedError(ErrorCode.BadRequest, error.message);
    }

    if (result) {
      ctx.state.cache.student = JSON.parse(result) as IFetchStudentPayload[];
    }
  });

  return next();
};

/**
 * ANCHOR: Sets a new cache in redis with the student:all as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched student
 */
export const setCacheAllStudent = (
  payload: IFetchStudentPayload[],
) => {
  redisClient.setex('student:all', 3600, JSON.stringify(payload));
};
