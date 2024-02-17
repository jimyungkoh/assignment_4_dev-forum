import bodyParser from "body-parser";
import controllers from "../contexts";
import { ExpressApp } from "../types/ExpressApp.type";

export default async ({ app }: ExpressApp) => {
  app.use(bodyParser.json);
  app.use(controllers);
};
