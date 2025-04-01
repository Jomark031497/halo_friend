import { logger } from "./utils/logger.js";
import { createApp } from "./app.js";
import { db } from "./db/index.js";
import { users } from "./modules/users/users.schema.js";

async function main() {
  const app = createApp();
  const port = process.env.PORT;

  app.get("/", async (req, res) => {
    const result = await db.select().from(users);

    res.status(200).json(result);
  });

  app.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
  });
}

main().catch((err) => {
  logger.error(err);
});
