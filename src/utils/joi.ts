// ANCHOR Joi
import * as Joi from '@hapi/joi';

// ANCHOR Errors
import { PayloadValidationError } from '../errors/custom/PayloadValidationCodedError';
import { QueryParametersValidationError } from '../errors/custom/QueryParametersValidationError';

/* ANCHOR: Validation convenience utility ----------------------------------- */
const VALIDATE_OPTIONS: Joi.ValidationOptions = {
  abortEarly: false,
};

// ANCHOR Field error type
export interface IFieldError {
  readonly field: string;
  readonly error: string;
}

/**
 * ANCHOR: Validation error formatter utility
 * This function formats a Joi validation error object to a
 * more user-readable format to be sent back as an HTTP response
 * @param error Joi Validation Error object
 */
const formatFieldErrors = (
  error: Joi.ValidationError,
): IFieldError[] => (
  error.details
    .map((errorItem: Joi.ValidationErrorItem) => ({
      field: errorItem?.context?.key ?? '',
      error: errorItem.message,
    }))
);

/**
 * ANCHOR: This function validates a Joi Schema asynchronously
 * using the validation options
 * @param schema Joi Schema
 * @param value Value to be validated
 */
export const validateSchema = async (
  schema: Joi.Schema,
  value: any,
) => schema.validateAsync(value, VALIDATE_OPTIONS);

/**
 * ANCHOR: This function validates a Joi Schema asynchronously
 * using the validation options
 * @param schema Joi Schema
 * @param payload Object to validate
 */
export const validatePayload = async (
  schema: Joi.Schema,
  payload: any,
) => {
  try {
    return await validateSchema(schema, payload);
  } catch (error) {
    const fieldErrors = formatFieldErrors(error);
    throw new PayloadValidationError(fieldErrors);
  }
};

/**
 * ANCHOR: This function validates a Joi Schema asynchronously
 * using the validation options
 * @param schema Joi Schema
 * @param queryParameters Query params to validate
 */
export const validateQueryParameters = async (
  schema: Joi.Schema,
  queryParameters: any,
) => {
  try {
    return await validateSchema(schema, queryParameters);
  } catch (error) {
    const fieldErrors = formatFieldErrors(error);
    throw new QueryParametersValidationError(fieldErrors);
  }
};
