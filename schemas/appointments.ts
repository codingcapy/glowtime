import {
  pgTable,
  varchar,
  timestamp,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";

export const appointments = pgTable("appointments", {
  appointmentId: serial("appointment_id").primaryKey(),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  type: varchar("type").notNull(),
  duration: integer("duration").notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Appointment = InferSelectModel<typeof appointments>;
