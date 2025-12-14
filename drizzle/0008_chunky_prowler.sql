ALTER TABLE "projects" RENAME COLUMN "image_link" TO "cover_image";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "images" text[];