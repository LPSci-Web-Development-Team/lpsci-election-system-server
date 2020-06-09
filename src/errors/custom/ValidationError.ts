// ANCHOR Erros
import { CodedError } from './CodedError';
import { ErrorCode } from '../index';

// ANCHOR Utils
import { IFieldError } from '../../utils/joi';

export class ValidationError extends CodedError {
  public readonly fieldErrors: IFieldError[];

  constructor(
    fieldErrrors: IFieldError[],
    errorCode: ErrorCode = ErrorCode.ValidationError,
    message = 'Error validating object',
  ) {
    super(errorCode, message);
    this.fieldErrors = fieldErrrors;

    /**
     * NOTE: This workaround was recommended by Microsoft
     * https://bit.ly/2j94DZX
     */
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
