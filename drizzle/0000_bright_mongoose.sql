CREATE TABLE IF NOT EXISTS "certificate" (
	"id" serial PRIMARY KEY NOT NULL,
	"certTitle" text NOT NULL,
	"certDesc" text NOT NULL,
	"imageLink" text NOT NULL,
	"courseLink" text NOT NULL,
	"profLink" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"postTitle" text NOT NULL,
	"postContent" text NOT NULL,
	"slug" text NOT NULL,
	"postImageLink" text NOT NULL,
	"published" boolean NOT NULL,
	"postsCategories" text[] NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" serial PRIMARY KEY NOT NULL,
	"projTitle" text NOT NULL,
	"projDesc" text NOT NULL,
	"repoLink" text NOT NULL,
	"liveLink" text NOT NULL,
	"projImageLink" text NOT NULL,
	"projCategories" text[] NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
