// ANCHOR Errors
import { CodedError } from './CodedError';
import { ErrorCode } from '../index';

export class NotFoundError extends CodedError {
  constructor(message = 'Item could not be found') {
    super(ErrorCode.NotFound, message);

    /**
     * NOTE: This workaround was recommended by Microsoft
     * https://bit.ly/2j94DZX
     */
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
