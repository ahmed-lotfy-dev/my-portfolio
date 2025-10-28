ALTER TABLE "projects" RENAME COLUMN "desc" TO "desc_en";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "desc_ar" text NOT NULL;