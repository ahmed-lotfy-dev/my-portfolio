import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const certificates = pgTable("certificate", {
  id: serial("id").primaryKey(),
  certTitle: text("certTitle").notNull(),
  certDesc: text("certDesc").notNull(),
  certImageLink: text("imageLink").notNull(),
  courseLink: text("courseLink").notNull(),
  profLink: text("profLink").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type Certificate = InferSelectModel<typeof certificates>;
export type NewCertificate = InferInsertModel<typeof certificates>;
