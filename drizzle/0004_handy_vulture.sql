ALTER TABLE "projects" RENAME COLUMN "title" TO "title_en";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "title_ar" text NOT NULL;