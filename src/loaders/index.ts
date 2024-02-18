import "../database/sql";
import { ExpressApp } from "../types/Express.type";
import expressLoader from "./express.loader";

const loaders = {
  init: async ({ app }: ExpressApp) => {
    await expressLoader({ app });
  },
};

export default loaders;
