import { NextFunction, Request, RequestHandler, Response } from "express";

export default function wrapAsync(...handlers: RequestHandler[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(handlers.map((handler) => handler(req, res, next))).catch(
      next
    );
  };
}
