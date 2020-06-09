// ANCHOR Errors
import { CodedError } from './CodedError';
import { ErrorCode } from '../index';

export class AuthorizationError extends CodedError {
  constructor(message = 'User is not authorized to access this endpoint') {
    super(ErrorCode.Unauthorized, message);

    /**
     * NOTE: This workaround was recommended by Microsoft
     * https://bit.ly/2j94DZX
     */
    Object.setPrototypeOf(this, CodedError.prototype);
  }
}
