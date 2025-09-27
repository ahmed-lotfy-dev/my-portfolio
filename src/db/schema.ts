import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { sql } from "drizzle-orm"

// Role Enum
export const roleEnum = pgEnum("Role", ["USER", "ADMIN"])

// -------------------- User --------------------
export const users = pgTable("User", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`), // ✅ UUID
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: roleEnum("role").notNull().default("USER"),
})

// -------------------- Post --------------------
export const posts = pgTable("Post", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull(),
  imageLink: text("imageLink").notNull(),
  published: boolean("published").notNull(),
  categories: text("categories").array().notNull(),
  authorId: uuid("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// -------------------- Project --------------------
export const projects = pgTable("Project", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  desc: text("desc").notNull(),
  repoLink: text("repoLink").notNull(),
  liveLink: text("liveLink").notNull(),
  imageLink: text("imageLink").notNull(),
  categories: text("categories").array().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// -------------------- Certificate --------------------
export const certificates = pgTable("Certificate", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  desc: text("desc").notNull(),
  imageLink: text("imageLink").notNull(),
  courseLink: text("courseLink").notNull(),
  profLink: text("profLink").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// -------------------- Account --------------------
export const accounts = pgTable(
  "Account",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    providerUnique: uniqueIndex("provider_providerAccountId").on(
      table.provider,
      table.providerAccountId
    ),
  })
)

// -------------------- Session --------------------
export const sessions = pgTable("Session", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  sessionToken: text("sessionToken").unique().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

// -------------------- VerificationToken --------------------
export const verificationTokens = pgTable(
  "VerificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").unique().notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    identifierTokenUnique: uniqueIndex("identifier_token").on(
      table.identifier,
      table.token
    ),
  })
)

// -------------------- Relations --------------------
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  accounts: many(accounts),
  sessions: many(sessions),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))
