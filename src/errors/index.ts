// ANCHOR Status Codes
import * as status from 'http-status-codes';

export enum ErrorCode {
  EmailExists = 'email-exists',
  UnknownError = 'unknown-error',
  ValidationError = 'validation-error',
  PayloadValidationError = 'payload-validation-error',
  QueryParametersValidationError = 'query-parameters-validation-error',
  DatabaseError = 'database-error',
  Unauthenticated = 'unauthenticated',
  Unauthorized = 'unauthorized',
  NotFound = 'not-found',
  BadRequest = 'bad-request',
  FieldExists = 'field-exists',
}

export const ERROR_CODE_TO_HTTP_STATUS = new Map<ErrorCode, number>([
  [ErrorCode.EmailExists, status.BAD_REQUEST],
  [ErrorCode.UnknownError, status.INTERNAL_SERVER_ERROR],
  [ErrorCode.ValidationError, status.BAD_REQUEST],
  [ErrorCode.PayloadValidationError, status.BAD_REQUEST],
  [ErrorCode.QueryParametersValidationError, status.BAD_REQUEST],
  [ErrorCode.DatabaseError, status.INTERNAL_SERVER_ERROR],
  [ErrorCode.Unauthenticated, status.UNAUTHORIZED],
  [ErrorCode.Unauthorized, status.FORBIDDEN],
  [ErrorCode.NotFound, status.NOT_FOUND],
  [ErrorCode.BadRequest, status.BAD_REQUEST],
  [ErrorCode.FieldExists, status.BAD_REQUEST],
]);
