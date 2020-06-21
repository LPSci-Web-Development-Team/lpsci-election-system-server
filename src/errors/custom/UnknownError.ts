// ANCHOR Errors
import { CodedError } from './CodedError';
import { ErrorCode } from '../index';

export class UnknownError extends CodedError {
  constructor(message: string) {
    super(ErrorCode.UnknownError, message);

    /**
     * NOTE: This workaround was recommended by Microsoft
     * https://bit.ly/2j94DZX
     */
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}
