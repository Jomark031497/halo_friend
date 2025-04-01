import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { logger } from "../utils/logger.js";
import * as users from "../modules/users/users.schema.js";

const queryClient = postgres(<string>process.env.DATABASE_URL);

export const db = drizzle({
  client: queryClient,
  schema: {
    ...users,
  },
});

// Gracefully close the database connection
export const closeDbConnection = async () => {
  try {
    await queryClient.end();
    logger.info("Database connection closed.");
  } catch (error) {
    logger.error("Error closing database connection:", error);
  }
};
