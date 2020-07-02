// ANCHOR Redis
import { redisClient } from '../../../index';

// ANCHOR Errors
import { CodedError } from '../../../errors/custom/CodedError';
import { ErrorCode } from '../../../errors';

// ANCHOR Payloads
import { IFetchPartyPayload } from '../../../models/payloads/party';
import { IFetchCandidatePayload } from '../../../models/payloads/candidate';

/**
 * ANCHOR: Returns the cached party if there are any.
 *
 * @param ctxParamName URL parameter name
 */
export const getCacheParty = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCacheVotes(): Promise<IFetchPartyPayload> {
      return new Promise((resolve) => {
        redisClient.get(`party:${params}`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchPartyPayload);
          } else {
            resolve(undefined);
          }
        });
      });
    }

    await getCacheVotes()
      .then((data) => {
        ctx.state.cache.party = data;
      });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the party:${params} as key.
 * NOTE: Expires in five minutes
 *
 * @param payload Fetched party
 */
export const setCacheParty = (
  params: string,
  payload: IFetchPartyPayload,
) => {
  redisClient.setex(`party:${params}`, 300, JSON.stringify(payload));
};


/**
 * ANCHOR: Returns the cached party if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllParty = async (
  ctx: any,
  next: () => Promise<void>,
) => {
  function getCache(): Promise<IFetchPartyPayload[]> {
    return new Promise((resolve) => {
      redisClient.get('party:all', (error, result) => {
        if (error) {
          throw new CodedError(ErrorCode.BadRequest, error.message);
        }

        if (result) {
          resolve(JSON.parse(result) as IFetchPartyPayload[]);
        } else {
          resolve(undefined);
        }
      });
    });
  }

  await getCache()
    .then((data) => {
      ctx.state.cache.parties = data;
    });

  return next();
};

/**
 * ANCHOR: Sets a new cache in redis with the
 * party:all as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched party
 */
export const setCacheAllParty = (
  payload: IFetchPartyPayload[],
) => {
  redisClient.setex('party:all', 3600, JSON.stringify(payload));
};

/**
 * ANCHOR: Returns the cached party if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllPartyCandidates = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCacheParties(): Promise<IFetchPartyPayload[]> {
      return new Promise((resolve) => {
        redisClient.get(`party:${params}:candidates`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchPartyPayload[]);
          } else {
            resolve(undefined);
          }
        });
      });
    }

    await getCacheParties()
      .then((data) => {
        ctx.state.cache.partyCandidates = data;
      });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the
 * party:${params}:candidates as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched candidates
 */
export const setCacheAllPartyCandidates = (
  payload: IFetchCandidatePayload[],
  params: string,
) => {
  redisClient.setex(`party:${params}:candidates`, 3600, JSON.stringify(payload));
};
