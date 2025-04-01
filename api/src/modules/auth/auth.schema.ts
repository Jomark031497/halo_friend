import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users/users.schema.js";

export const sessionTable = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => {
    return {
      userIdIndex: index("idx_session_user_id").on(table.userId),
      expiresAtIndex: index("idx_session_expires_at").on(table.expiresAt),
    };
  }
);

export type Session = typeof sessionTable.$inferSelect;
