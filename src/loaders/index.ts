import "../prisma";
import { ExpressApp } from "../types/ExpressApp.type";
import expressLoader from "./expressLoader";

const loaders = {
  init: async ({ app }: ExpressApp) => {
    await expressLoader({ app });
  },
};

export default loaders;
