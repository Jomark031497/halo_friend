import express from "express";
import { logger } from "./utils/logger.js";

async function main() {
  const app = express();
  const port = process.env.PORT;

  app.use(express.urlencoded());
  app.use(express.json());

  app.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
  });
}

main().catch((err) => {
  logger.error(err);
});
