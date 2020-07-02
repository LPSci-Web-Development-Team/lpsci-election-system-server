// ANCHOR Redis
import { redisClient } from '../../../index';

// ANCHOR Errors
import { CodedError } from '../../../errors/custom/CodedError';
import { ErrorCode } from '../../../errors';

// ANCHOR Payloads
import { IFetchSectionPayload } from '../../../models/payloads/section';
import { IFetchStudentPayload } from '../../../models/payloads/student';

/**
 * ANCHOR: Returns the cached section if there are any.
 *
 * @param ctxParamName URL parameter name
 */
export const getCacheSection = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCacheVotes(): Promise<IFetchSectionPayload> {
      return new Promise((resolve) => {
        redisClient.get(`section:${params}`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchSectionPayload);
          }
        });
      });
    }

    await getCacheVotes()
      .then((data) => {
        ctx.state.cache.section = data;
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
export const getCacheAllSection = async (
  ctx: any,
  next: () => Promise<void>,
) => {
  function getCache(): Promise<IFetchSectionPayload[]> {
    return new Promise((resolve) => {
      redisClient.get('section:all', (error, result) => {
        if (error) {
          throw new CodedError(ErrorCode.BadRequest, error.message);
        }

        if (result) {
          resolve(JSON.parse(result) as IFetchSectionPayload[]);
        }
      });
    });
  }

  await getCache()
    .then((data) => {
      ctx.state.cache.sections = data;
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

/**
 * ANCHOR: Returns the cached students for section
 * if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllSectionStudents = (
  id: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[id];

    function getCacheStudents(): Promise<IFetchStudentPayload[]> {
      return new Promise((resolve) => {
        redisClient.get(`section:${params}:students`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchStudentPayload[]);
          }
        });
      });
    }

    await getCacheStudents()
      .then((data) => {
        ctx.state.cache.partyCandidates = data;
      });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the
 * section:${params}:students as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched students for section
 */
export const setCacheAllSectionStudents = (
  payload: IFetchStudentPayload[],
  params: string,
) => {
  redisClient.setex(
    // Key
    `section:${params}:students`,
    // TTL (seconds)
    3600,
    // Payload
    JSON.stringify(payload),
  );
};
