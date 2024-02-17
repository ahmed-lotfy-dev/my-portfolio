
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { timestamp, pgTable, text, serial } from "drizzle-orm/pg-core";

export const projects = pgTable("project", {
  id: serial("id").primaryKey(),
  projTitle: text("projTitle").notNull(),
  projDesc: text("projDesc").notNull(),
  repoLink: text("repoLink").notNull(),
  liveLink: text("liveLink").notNull(),
  projImageLink: text("projImageLink").notNull(),
  projCategories: text("projCategories").array().notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type Project = InferSelectModel<typeof projects>;
export type NewCertificate = InferInsertModel<typeof projects>;
