// ANCHOR Errors
import { ErrorCode } from '../index';
import { ValidationError } from './ValidationError';

// ANCHOR Utils
import { IFieldError } from '../../utils/joi';

export class PayloadValidationError extends ValidationError {
  constructor(fieldErrrors: IFieldError[]) {
    super(
      fieldErrrors,
      ErrorCode.PayloadValidationError,
      'Error validating request payload',
    );

    /**
     * NOTE: This workaround was recommended by Microsoft
     * https://bit.ly/2j94DZX
     */
    Object.setPrototypeOf(this, PayloadValidationError.prototype);
  }
}
