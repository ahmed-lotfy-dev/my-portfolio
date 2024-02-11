import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const posts = pgTable("post", {
  id: serial("id").primaryKey(),
  postTitle: text("postTitle").notNull(),
  postContent: text("postContent").notNull(),
  slug: text("slug").notNull(),
  postImageLink: text("postImageLink").notNull(),
  published: boolean("published").notNull(),
  postsCategories: text("postsCategories").array().notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;
