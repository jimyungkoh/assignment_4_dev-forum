import dotenv from "dotenv";
import express from "express";
import loaders from "./loaders";

async function startServer() {
  dotenv.config();

  const app = express();
  const port = process.env.PORT || 5050;

  await loaders.init({ app });

  app.listen(port);
}

startServer();
