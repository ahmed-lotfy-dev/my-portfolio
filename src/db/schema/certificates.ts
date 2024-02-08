import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const certificates = pgTable("certificate", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  desc: text("desc").notNull(),
  imageLink: text("imageLink").notNull(),
  courseLink: text("courseLink").notNull(),
  profLink: text("profLink").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type Certificate = InferSelectModel<typeof certificates>;
export type NewCertificate = InferInsertModel<typeof certificates>;
