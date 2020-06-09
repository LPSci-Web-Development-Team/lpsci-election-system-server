// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHIR Utils
import { IFieldError } from './joi';
import { logger } from './logger';

// ANCHOR Errors
import { ErrorCode, ERROR_CODE_TO_HTTP_STATUS } from '../errors';
import { CodedError } from '../errors/custom/CodedError';
import { ValidationError } from '../errors/custom/ValidationError';
import { UnknownError } from '../errors/custom/UnknownError';

// ANCHOR: Coded error response interface
interface ICodedErrorResponse {
  readonly code: ErrorCode;
  readonly message: string;
  readonly fields?: IFieldError[];
}

/**
 * ANCHOR: CodedError to response object function
 * @param error Coded Error
 */
const codedErrorToBody = (
  error: CodedError,
): ICodedErrorResponse => ({
  code: error.code,
  message: error.message,
  fields: error instanceof ValidationError
    ? error.fieldErrors
    : undefined,
});

/**
 * ANCHOR: CatchResponseError Koa Middleware
 * @param ctx Koa ctx
 * @param next Next handler
 */
export const catchResponseError = async (
  ctx: any,
  next: () => Promise<any>,
) => {
  try {
    return await next();
  } catch (error) {
    ctx.body = { error: {} };

    if (error instanceof CodedError) {
      ctx.status = ERROR_CODE_TO_HTTP_STATUS.get(error.code)
        || status.BAD_REQUEST;
      ctx.body.error = codedErrorToBody(error);
    } else {
      logger.error('Koa caught an unknown error: ', error.message);
      ctx.status = status.INTERNAL_SERVER_ERROR;
      ctx.body.error = codedErrorToBody(new UnknownError(error.message));
    }

    return Promise.resolve();
  }
};
