import { pgTable, uniqueIndex, foreignKey, text, timestamp, unique, boolean, uuid, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const role = pgEnum("role", ['USER', 'ADMIN'])


export const accounts = pgTable("accounts", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	tokenType: text("token_type"),
	scope: text(),
}, (table) => [
	uniqueIndex("accounts_provider_account_unique").using("btree", table.providerId.asc().nullsLast().op("text_ops"), table.accountId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("sessions_token_unique").on(table.token),
]);

export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	role: role().default('USER').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const certificates = pgTable("certificates", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	desc: text().notNull(),
	imageLink: text("image_link").notNull(),
	courseLink: text("course_link").notNull(),
	profLink: text("prof_link").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const posts = pgTable("posts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleEn: text("title_en").notNull(),
	contentEn: text("content_en").notNull(),
	slug: text().notNull(),
	imageLink: text("image_link"),
	published: boolean().default(false).notNull(),
	categories: text().array().notNull(),
	authorId: text("author_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	titleAr: text("title_ar").notNull(),
	contentAr: text("content_ar").notNull(),
	originalLink: text("original_link").notNull(),
}, (table) => [
	unique("posts_slug_unique").on(table.slug),
]);

export const projects = pgTable("projects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titleEn: text("title_en").notNull(),
	titleAr: text("title_ar").notNull(),
	descEn: text("desc_en").notNull(),
	descAr: text("desc_ar").notNull(),
	repoLink: text("repo_link").notNull(),
	liveLink: text("live_link").notNull(),
	imageLink: text("image_link").notNull(),
	categories: text().array().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});
