import bodyParser from "body-parser";
import passport from "passport";
import routers from "../contexts";
import "../middlewares/auth-middleware";
import authMiddleware from "../middlewares/auth-middleware";
import errorMiddleware from "../middlewares/error.middleware";
import { ExpressApp } from "../types/Express.type";

export default async ({ app }: ExpressApp) => {
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(authMiddleware);
  app.use(routers);
  app.use(errorMiddleware);
};
