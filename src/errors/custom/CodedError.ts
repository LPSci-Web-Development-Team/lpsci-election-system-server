// ANCHOR Errors
import { ErrorCode } from '../index';

export class CodedError extends Error {
  public readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;

    /**
     * NOTE: This workaround was recommended by Microsoft
     * https://bit.ly/2j94DZX
     */
    Object.setPrototypeOf(this, CodedError.prototype);
  }
}
