import * as Joi from '@hapi/joi';

import { validatePayload, validateQueryParameters } from '../joi';

/**
 * ANCHOR: Set state validated payload
 * Given a Joi schema, validate request body and set state payload to result
 * @param schema
 */
export const setStateValidatedPayload = (
  schema: Joi.Schema,
) => (
  async (
    ctx: any,
    next: () => Promise<any>,
  ) => {
    ctx.state.payload = await validatePayload(schema, ctx.request.body);
    return next();
  }
);

/**
 * ANCHOR: Set validated query parameters
 * Given a Joi schema, validate query parameters and set context query to result
 * @param schema
 */
export const setValidatedQueryParameters = (
  schema: Joi.Schema,
) => (
  async (
    ctx: any,
    next: () => Promise<any>,
  ) => {
    ctx.query = await validateQueryParameters(schema, ctx.query);
    return next();
  }
);
