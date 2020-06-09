// ANCHOR Errors
import { CodedError } from './CodedError';
import { ErrorCode } from '../index';

export class FieldExists extends CodedError {
  constructor(message = 'Item already exists') {
    super(ErrorCode.FieldExists, message);

    /**
     * NOTE: This workaround was recommended by Microsoft
     * https://bit.ly/2j94DZX
     */
    Object.setPrototypeOf(this, FieldExists.prototype);
  }
}
