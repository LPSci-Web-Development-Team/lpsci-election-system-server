// ANCHOR Redis
import { redisClient } from '../../../index';

// ANCHOR Errors
import { CodedError } from '../../../errors/custom/CodedError';
import { ErrorCode } from '../../../errors';

// ANCHOR Payloads
import { IFetchSchoolYearPayload } from '../../../models/payloads/schoolYear';
import { IFetchSectionPayload } from '../../../models/payloads/section';
import { IFetchPartyPayload } from '../../../models/payloads/party';

/**
 * ANCHOR: Returns the cached schoolYear if there are any.
 *
 * @param ctxParamName URL parameter name
 */
export const getCacheSchoolYear = (
  ctxParamName: string,
) => (
  async function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[ctxParamName];

    function getCacheById(): Promise<IFetchSchoolYearPayload> {
      return new Promise((resolve) => {
        redisClient.get(`school-year:${params}`, (error, result) => {
          if (error) {
            throw new CodedError(ErrorCode.BadRequest, error.message);
          }

          if (result) {
            resolve(JSON.parse(result) as IFetchSchoolYearPayload);
          }
        });
      });
    }

    await getCacheById()
      .then((data) => {
        ctx.state.cache.schoolYear = data;
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
export const getCacheAllSchoolYear = async (
  ctx: any,
  next: () => Promise<void>,
) => {
  function getCache(): Promise<IFetchSchoolYearPayload[]> {
    return new Promise((resolve) => {
      redisClient.get('school-year:all', (error, result) => {
        if (error) {
          throw new CodedError(ErrorCode.BadRequest, error.message);
        }

        if (result) {
          resolve(JSON.parse(result) as IFetchSchoolYearPayload[]);
        }
      });
    });
  }

  await getCache()
    .then((data) => {
      ctx.state.cache.schoolYears = data;
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


/**
 * ANCHOR: Returns the cached sections for school year
 * if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllSchoolYearSections = (
  year: string,
) => (
  function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[year];

    redisClient.get(`school-year:${params}:sections`, (error, result) => {
      if (error) {
        throw new CodedError(ErrorCode.BadRequest, error.message);
      }

      if (result) {
        ctx.state.cache.schoolYearSections = JSON.parse(result) as IFetchSectionPayload[];
      }
    });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the
 * school-year:all:${year} as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched sections for school year
 */
export const setCacheAllSchoolYearSections = (
  payload: IFetchSectionPayload[],
  params: string,
) => {
  redisClient.setex(
    // Key
    `school-year:${params}:sections`,
    // TTL (seconds)
    3600,
    // Payload
    JSON.stringify(payload),
  );
};


/**
 * ANCHOR: Returns the cached parties for school year
 * if there are any.
 *
 * @param ctx Koa context
 * @param next Next middlware
 */
export const getCacheAllSchoolYearParties = (
  year: string,
) => (
  function getCache(
    ctx: any,
    next: () => Promise<void>,
  ) {
    const params = ctx.params[year];

    redisClient.get(`school-year:${params}:parties`, (error, result) => {
      if (error) {
        throw new CodedError(ErrorCode.BadRequest, error.message);
      }

      if (result) {
        ctx.state.cache.schoolYearParties = JSON.parse(result) as IFetchPartyPayload[];
      }
    });

    return next();
  }
);

/**
 * ANCHOR: Sets a new cache in redis with the
 * school-year:all:${year} as key.
 * NOTE: Expires in one hour
 *
 * @param payload Fetched parties for school year
 */
export const setCacheAllSchoolYearParties = (
  payload: IFetchPartyPayload[],
  params: string,
) => {
  redisClient.setex(
    // Key
    `school-year:${params}:parties`,
    // TTL (seconds)
    3600,
    // Payload
    JSON.stringify(payload),
  );
};
