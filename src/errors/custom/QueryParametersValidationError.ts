// ANCHOR Errors
import { ErrorCode } from '../index';
import { ValidationError } from './ValidationError';

// ANCHOR Utils
import { IFieldError } from '../../utils/joi';

export class QueryParametersValidationError extends ValidationError {
  constructor(fieldErrrors: IFieldError[]) {
    super(
      fieldErrrors,
      ErrorCode.QueryParametersValidationError,
      'Error validating request query parameters',
    );

    /**
     * NOTE: This workaround was recommended by Microsoft
     * https://bit.ly/2j94DZX
     */
    Object.setPrototypeOf(this, QueryParametersValidationError.prototype);
  }
}
