import { pgTable, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";

export const appointments = pgTable("appointments", {
  appointmentId: serial("appointment_id").primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  type: varchar("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = InferSelectModel<typeof appointments>;
