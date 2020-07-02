// ANCHOR Redis
import { redisClient } from '../../../index';

// ANCHOR Errors
import { CodedError } from '../../../errors/custom/CodedError';
import { ErrorCode } from '../../../errors';

// ANCHOR Payloads
import { IFetchVotePayload } from '../../../models/payloads/vote';

/**
 * ANCHOR: Returns the cached vote if there are any.
 *
 * @param ctxParamName URL parameter name
 */
export const getCacheVote = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCacheVotes(): Promise<IFetchVotePayload> {
      return new Promise((resolve) => {
        redisClient.get(`vote:${params}`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchVotePayload);
          }
        });
      });
    }

    await getCacheVotes()
      .then((data) => {
        ctx.state.cache.vote = data;
      });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the vote:${params} as key.
 * NOTE: Expires in five minutes
 *
 * @param payload Fetched vote
 */
export const setCacheVote = (
  params: string,
  payload: IFetchVotePayload,
) => {
  redisClient.setex(`vote:${params}`, 300, JSON.stringify(payload));
};


/**
 * ANCHOR: Returns the cached vote if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllVote = async (
  ctx: any,
  next: () => Promise<void>,
) => {
  function getCache(): Promise<IFetchVotePayload[]> {
    return new Promise((resolve) => {
      redisClient.get('vote:all', (error, result) => {
        if (error) {
          throw new CodedError(ErrorCode.BadRequest, error.message);
        }

        if (result) {
          resolve(JSON.parse(result) as IFetchVotePayload[]);
        }
      });
    });
  }

  await getCache()
    .then((data) => {
      ctx.state.cache.votes = data;
    });

  return next();
};

/**
 * ANCHOR: Sets a new cache in redis with the vote:all as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched vote
 */
export const setCacheAllVote = (
  payload: IFetchVotePayload[],
) => {
  redisClient.setex('vote:all', 3600, JSON.stringify(payload));
};
