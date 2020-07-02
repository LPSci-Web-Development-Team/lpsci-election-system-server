// ANCHOR Redis
import { redisClient } from '../../../index';

// ANCHOR Errors
import { CodedError } from '../../../errors/custom/CodedError';
import { ErrorCode } from '../../../errors';

// ANCHOR Payloads
import { IFetchCandidatePayload } from '../../../models/payloads/candidate';
import { IFetchVotePayload } from '../../../models/payloads/vote';

/**
 * ANCHOR: Returns the cached candidate if there are any.
 *
 * @param ctxParamName URL parameter name
 */
export const getCacheCandidate = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCacheById(): Promise<IFetchCandidatePayload> {
      return new Promise((resolve) => {
        redisClient.get(`candidate:${params}`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchCandidatePayload);
          } else {
            resolve(undefined);
          }
        });
      });
    }

    await getCacheById()
      .then((data) => {
        ctx.state.cache.candidate = data;
      });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the candidate:${params} as key.
 * NOTE: Expires in five minutes
 *
 * @param payload Fetched candidate
 */
export const setCacheCandidate = (
  params: string,
  payload: IFetchCandidatePayload,
) => {
  redisClient.setex(`candidate:${params}`, 300, JSON.stringify(payload));
};


/**
 * ANCHOR: Returns the cached candidate if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllCandidate = async (
  ctx: any,
  next: () => Promise<void>,
) => {
  function getCache(): Promise<IFetchCandidatePayload[]> {
    return new Promise((resolve) => {
      redisClient.get('candidate:all', (error, result) => {
        if (error) {
          throw new CodedError(ErrorCode.BadRequest, error.message);
        }

        if (result) {
          resolve(JSON.parse(result) as IFetchCandidatePayload[]);
        } else {
          resolve(undefined);
        }
      });
    });
  }

  await getCache()
    .then((data) => {
      ctx.state.cache.candidates = data;
    });

  return next();
};

/**
 * ANCHOR: Sets a new cache in redis with the
 * candidate:all as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched candidate
 */
export const setCacheAllCandidate = (
  payload: IFetchCandidatePayload[],
) => {
  redisClient.setex('candidate:all', 3600, JSON.stringify(payload));
};

/**
 * ANCHOR: Returns the cached candidate if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllCandidateByPosition = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCachePositions(): Promise<IFetchCandidatePayload[]> {
      return new Promise((resolve) => {
        redisClient.get(`candidate:all:position:${params}`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchCandidatePayload[]);
          } else {
            resolve(undefined);
          }
        });
      });
    }

    await getCachePositions()
      .then((data) => {
        ctx.state.cache.candidatesPosition = data;
      });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the
 * candidate:all:position:${params} as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched candidate
 */
export const setCacheAllCandidateByPosition = (
  payload: IFetchCandidatePayload[],
  params: string,
) => {
  redisClient.setex(`candidate:all:position:${params}`, 3600, JSON.stringify(payload));
};

/**
 * ANCHOR: Returns the cached candidate if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllCandidateByState = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCacheStates(): Promise<IFetchCandidatePayload[]> {
      return new Promise((resolve) => {
        redisClient.get(`candidate:all:state:${params}`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchCandidatePayload[]);
          } else {
            resolve(undefined);
          }
        });
      });
    }

    await getCacheStates()
      .then((data) => {
        ctx.state.cache.candidatesState = data;
      });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the
 * candidate:all:state:${params} as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched candidate
 */
export const setCacheAllCandidateByState = (
  payload: IFetchCandidatePayload[],
  params: string,
) => {
  redisClient.setex(`candidate:all:state:${params}`, 3600, JSON.stringify(payload));
};


/**
 * ANCHOR: Returns the cached candidate if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllCandidateVotes = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCacheVotes(): Promise<IFetchVotePayload[]> {
      return new Promise((resolve) => {
        redisClient.get(`candidate:${params}:votes`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchVotePayload[]);
          } else {
            resolve(undefined);
          }
        });
      });
    }

    await getCacheVotes()
      .then((data) => {
        ctx.state.cache.candidateVotes = data;
      });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the
 * candidate:${params}:votes as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched votes
 */
export const setCacheAllCandidateVotes = (
  payload: IFetchVotePayload[],
  params: string,
) => {
  redisClient.setex(`candidate:${params}:votes`, 3600, JSON.stringify(payload));
};
