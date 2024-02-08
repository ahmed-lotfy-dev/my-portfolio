import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { timestamp, pgTable, text, serial } from "drizzle-orm/pg-core";

export const projects = pgTable("project", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  desc: text("title").notNull(),
  repoLink: text("repoLink").notNull(),
  liveLink: text("liveLink").notNull(),
  imageLink: text("imageLink").notNull(),
  categories: text("categories").array().notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type Certificate = InferSelectModel<typeof projects>;
export type NewCertificate = InferInsertModel<typeof projects>;
