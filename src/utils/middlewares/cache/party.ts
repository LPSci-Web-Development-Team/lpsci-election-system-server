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
  function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    redisClient.get(`party:${params}`, (error, result) => {
      if (error) {
        throw new CodedError(ErrorCode.BadRequest, error.message);
      }

      if (result) {
        ctx.state.cache.party = JSON.parse(result) as IFetchPartyPayload;
      }
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
export const getCacheAllParty = (
  ctx: any,
  next: () => Promise<void>,
) => {
  redisClient.get('party:all', (error, result) => {
    if (error) {
      throw new CodedError(ErrorCode.BadRequest, error.message);
    }

    if (result) {
      ctx.state.cache.parties = JSON.parse(result) as IFetchPartyPayload[];
    }
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
  function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    redisClient.get(`party:${params}:candidates`, (error, result) => {
      if (error) {
        throw new CodedError(ErrorCode.BadRequest, error.message);
      }

      if (result) {
        ctx.state.cache.partyCandidates = JSON.parse(result) as IFetchCandidatePayload;
      }
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
