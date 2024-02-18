import { HttpClientErrorStatusCode } from "../types/HttpStatus.type";
import HttpError from "./http.error";

class HttpClientSideError extends HttpError {
  constructor(statusCode: HttpClientErrorStatusCode, message: string) {
    super({ statusCode, message });
  }
}

export class BadRequestError extends HttpClientSideError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpClientSideError {
  constructor(message: string) {
    super(401, message);
  }
}

export class ForbiddenError extends HttpClientSideError {
  constructor(message: string) {
    super(403, message);
  }
}

export class NotFoundError extends HttpClientSideError {
  constructor(message: string) {
    super(404, message);
  }
}

export class ConflictError extends HttpClientSideError {
  constructor(message: string) {
    super(409, message);
  }
}
