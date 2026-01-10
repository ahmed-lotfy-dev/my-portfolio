import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: roleEnum("role").notNull().default("USER"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    providerAccountUnique: uniqueIndex("accounts_provider_account_unique").on(
      table.providerId,
      table.accountId
    ),
  })
);

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  // New language-specific fields
  title_en: text("title_en").notNull(),
  content_en: text("content_en").notNull(),
  title_ar: text("title_ar").notNull(),
  content_ar: text("content_ar").notNull(),

  // Existing fields
  slug: text("slug").notNull().unique(),
  imageLink: text("image_link"), // Assuming a link, not always available in RSS
  originalLink: text("original_link").notNull(), // A new field for the source link
  published: boolean("published").notNull().default(false),
  categories: text("categories").array().notNull(),
  author: text("author_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title_en: text("title_en").notNull(),
  title_ar: text("title_ar").notNull(),
  desc_en: text("desc_en").notNull(),
  desc_ar: text("desc_ar").notNull(),
  repoLink: text("repo_link").notNull(),
  liveLink: text("live_link").notNull(),
  coverImage: text("cover_image"),
  slug: text("slug").unique(),
  content_en: text("content_en"),
  content_ar: text("content_ar"),
  categories: text("categories").array().notNull(),
  images: text("images").array(),
  published: boolean("published").notNull().default(true),
  displayOrder: integer("display_order").default(0),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const experiences = pgTable("experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  company: text("company").notNull(),
  role_en: text("role_en").notNull(),
  role_ar: text("role_ar").notNull(),
  description_en: text("description_en").notNull(),
  description_ar: text("description_ar").notNull(),
  date_en: text("date_en").notNull(),
  date_ar: text("date_ar").notNull(),
  tech_stack: text("tech_stack").array().notNull(),
  displayOrder: integer("display_order").default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const certificates = pgTable("certificates", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  desc: text("desc").notNull(),
  imageLink: text("image_link").notNull(),
  courseLink: text("course_link").notNull(),
  profLink: text("prof_link").notNull(),
  completedAt: timestamp("completed_at"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const backupLogs = pgTable("backup_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: text("status").notNull(), // PENDING, SUCCESS, FAILED
  type: text("type").notNull(), // full, sql, media
  path: text("path"),
  sizeBytes: integer("size_bytes"),
  details: text("details"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.author],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
