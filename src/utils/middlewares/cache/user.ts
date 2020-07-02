// ANCHOR Redis
import { redisClient } from '../../../index';

// ANCHOR Errors
import { CodedError } from '../../../errors/custom/CodedError';
import { ErrorCode } from '../../../errors';

// ANCHOR Payloads
import { IFetchUserPayload } from '../../../models/payloads/user';

/**
 * ANCHOR: Returns the cached user if there are any.
 *
 * @param ctxParamName URL parameter name
 */
export const getCacheUser = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCacheVotes(): Promise<IFetchUserPayload> {
      return new Promise((resolve) => {
        redisClient.get(`user:${params}`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchUserPayload);
          }
        });
      });
    }

    await getCacheVotes()
      .then((data) => {
        ctx.state.cache.user = data;
      });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the user:${params} as key.
 * NOTE: Expires in five minutes
 *
 * @param payload Fetched user
 */
export const setCacheUser = (
  params: string,
  payload: IFetchUserPayload,
) => {
  redisClient.setex(`user:${params}`, 300, JSON.stringify(payload));
};


/**
 * ANCHOR: Returns the cached user if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllUser = async (
  ctx: any,
  next: () => Promise<void>,
) => {
  function getCache(): Promise<IFetchUserPayload[]> {
    return new Promise((resolve) => {
      redisClient.get('user:all', (error, result) => {
        if (error) {
          throw new CodedError(ErrorCode.BadRequest, error.message);
        }

        if (result) {
          resolve(JSON.parse(result) as IFetchUserPayload[]);
        }
      });
    });
  }

  await getCache()
    .then((data) => {
      ctx.state.cache.users = data;
    });

  return next();
};

/**
 * ANCHOR: Sets a new cache in redis with the user:all as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched user
 */
export const setCacheAllUser = (
  payload: IFetchUserPayload[],
) => {
  redisClient.setex('user:all', 3600, JSON.stringify(payload));
};
