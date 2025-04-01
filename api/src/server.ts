import { logger } from "./utils/logger.js";
import { createApp } from "./app.js";

async function main() {
  const app = createApp();
  const port = process.env.PORT;

  app.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
  });
}

main().catch((err) => {
  logger.error(err);
});
