// ANCHOR Redis
import { redisClient } from '../../../index';

// ANCHOR Errors
import { CodedError } from '../../../errors/custom/CodedError';
import { ErrorCode } from '../../../errors';

// ANCHOR Payloads
import { IFetchStudentPayload } from '../../../models/payloads/student';
import { IFetchVotePayload } from '../../../models/payloads/vote';


/**
 * ANCHOR: Returns the cached student if there are any.
 *
 * @param ctxParamName URL parameter name
 */
export const getCacheStudent = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCacheVotes(): Promise<IFetchStudentPayload> {
      return new Promise((resolve) => {
        redisClient.get(`student:${params}`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchStudentPayload);
          }
        });
      });
    }

    await getCacheVotes()
      .then((data) => {
        ctx.state.cache.student = data;
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
  redisClient.setex(
    // Key
    `student:${params}`,
    // TTL (seconds)
    300,
    // Payload
    JSON.stringify(payload),
  );
};


/**
 * ANCHOR: Returns the cached student if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllStudent = async (
  ctx: any,
  next: () => Promise<void>,
) => {
  function getCache(): Promise<IFetchStudentPayload[]> {
    return new Promise((resolve) => {
      redisClient.get('student:all', (error, result) => {
        if (error) {
          throw new CodedError(ErrorCode.BadRequest, error.message);
        }

        if (result) {
          resolve(JSON.parse(result) as IFetchStudentPayload[]);
        }
      });
    });
  }

  await getCache()
    .then((data) => {
      ctx.state.cache.students = data;
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
  redisClient.setex(
    // Key
    'student:all',
    // TTL (seconds)
    3600,
    // Payload
    JSON.stringify(payload),
  );
};

/**
 * ANCHOR: Returns the cached student if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllStudentVotes = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCacheVotes(): Promise<IFetchVotePayload[]> {
      return new Promise((resolve) => {
        redisClient.get(`student:${params}:votes`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchVotePayload[]);
          }
        });
      });
    }

    await getCacheVotes()
      .then((data) => {
        ctx.state.cache.studentVotes = data;
      });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the
 * student:${params}:votes as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched votes
 */
export const setCacheAllStudentVotes = (
  payload: IFetchVotePayload[],
  params: string,
) => {
  redisClient.setex(`student:${params}:votes`, 3600, JSON.stringify(payload));
};
