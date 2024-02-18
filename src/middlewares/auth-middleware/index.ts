import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { UnauthorizedError } from "../../errors/http-client-side.error";
import "./passport-custom-strategy";

const publicPathRegexes = [/^\/users\/sign-in$/, /^\/users\/sign-up$/];

const getAccessibleRegexes = [
  /^\/boards\/latest\/posts$/,
  /^\/boards\/(frontend|backend)\/posts$/,
];

export default function (req: Request, res: Response, next: NextFunction) {
  const publicPath = publicPathRegexes.some((regex) => regex.test(req.path));
  if (publicPath) return next();

  const getAccessible = getAccessibleRegexes.some((regex) =>
    regex.test(req.path)
  );

  if (getAccessible && req.method === "GET") return next();

  passport.authenticate(
    "jwt",
    { session: false },
    handleAuthentication(req, next)
  )(req, res, next);
}

const handleAuthentication = (req: Request, next: NextFunction) => {
  return (err: any, user: Request["user"], info: any, status: any) => {
    if (err || !user) {
      const httpError = new UnauthorizedError("인증에 실패했습니다.");
      return next(httpError);
    }
    req.user = user;
    next();
  };
};
