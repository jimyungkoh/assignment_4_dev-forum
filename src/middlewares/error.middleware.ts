import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import HttpError, { HttpErrorParams } from "../errors/http.error";
import formattedResponse from "../utils/formatted-response";

export default async function (
  err: Error | ValidationError | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!(err instanceof HttpError))
    err = new HttpError({ message: err.message } as HttpErrorParams);

  const { statusCode, success, result, message } = err as HttpError;

  res.status(statusCode).json(formattedResponse(success, result, message));

  next();
}
