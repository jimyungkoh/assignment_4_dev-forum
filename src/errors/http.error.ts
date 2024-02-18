import { HttpClientErrorStatusCode } from "../types/HttpStatus.type";

export interface HttpErrorParams {
  statusCode: HttpClientErrorStatusCode;
  message?: string;
}

export class HttpError extends Error {
  statusCode: HttpClientErrorStatusCode;
  result = null;
  success = false;

  constructor(params?: HttpErrorParams) {
    super(params?.message);
    this.statusCode = params?.statusCode ?? 400;
  }
}



export default HttpError;
