import express from "express";
import loaders from "./loaders";

async function startServer() {
  const app = express();
  const port = 5050;

  await loaders.init({ app });

  app.listen(port);
}
