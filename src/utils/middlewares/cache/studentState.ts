import { IFetchUserPayload } from '../../../models/payloads/user';
// ANCHOR Redis
import { redisClient } from '../../../index';

// ANCHOR Errors
import { CodedError } from '../../../errors/custom/CodedError';
import { ErrorCode } from '../../../errors';

// ANCHOR Payloads
import { IFetchStudentStatePayload } from '../../../models/payloads/studentState';

/**
 * ANCHOR: Returns the cached student state if there are any.
 *
 * @param ctxParamName URL parameter name
 */
export const getCacheStudentState = (
  ctxParamName: string,
) => (
  function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    redisClient.get(`student-state:${params}`, (error, result) => {
      if (error) {
        throw new CodedError(ErrorCode.BadRequest, error.message);
      }

      if (result) {
        ctx.state.cache.studentState = JSON.parse(result) as IFetchStudentStatePayload;
      }
    });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the
 * student-state:${params} as key.
 * NOTE: Expires in five minutes
 *
 * @param payload Fetched student state state
 */
export const setCacheStudentState = (
  params: string,
  payload: IFetchStudentStatePayload,
) => {
  redisClient.setex(
    // Key
    `student-state:${params}`,
    // TTL (seconds)
    300,
    // Payload
    JSON.stringify(payload),
  );
};

/**
 * ANCHOR: Returns the cached student states if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllStudentState = (
  ctx: any,
  next: () => Promise<void>,
) => {
  redisClient.get('student-state:all', (error, result) => {
    if (error) {
      throw new CodedError(ErrorCode.BadRequest, error.message);
    }

    if (result) {
      ctx.state.cache.studentStates = JSON.parse(result) as IFetchStudentStatePayload[];
    }
  });

  return next();
};

/**
 * ANCHOR: Sets a new cache in redis with the student:all as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched student state
 */
export const setCacheAllStudentState = (
  payload: IFetchStudentStatePayload[],
) => {
  redisClient.setex(
    // Key
    'student-state:all',
    // TTL (seconds)
    3600,
    // Payload
    JSON.stringify(payload),
  );
};

/**
 * ANCHOR: Returns the cached student states if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllStudentStateByYear = (
  year: string,
) => (
  function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[year];

    redisClient.get(`student-state:all:${params}`, (error, result) => {
      if (error) {
        throw new CodedError(ErrorCode.BadRequest, error.message);
      }

      if (result) {
        ctx.state.cache.studentStatesYear = JSON.parse(result) as IFetchStudentStatePayload[];
      }
    });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the
 * student-state:all:${year} as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched student state
 */
export const setCacheAllStudentStateByYear = (
  payload: IFetchStudentStatePayload[],
  year: string,
) => {
  redisClient.setex(
    // Key
    `student-state:all:${year}`,
    // TTL (seconds)
    3600,
    // Payload
    JSON.stringify(payload),
  );
};

/**
 * ANCHOR: Returns the cached users for student state
 * if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllStudentStateUsers = (
  id: string,
) => (
  function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[id];

    redisClient.get(`student-state:${params}:users`, (error, result) => {
      if (error) {
        throw new CodedError(ErrorCode.BadRequest, error.message);
      }

      if (result) {
        ctx.state.cache.studentStateUsers = JSON.parse(result) as IFetchUserPayload[];
      }
    });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the
 * student-state:all:${year} as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched users for student state
 */
export const setCacheAllStudentStateUsers = (
  payload: IFetchUserPayload[],
  params: string,
) => {
  redisClient.setex(
    // Key
    `student-state:${params}:users`,
    // TTL (seconds)
    3600,
    // Payload
    JSON.stringify(payload),
  );
};
