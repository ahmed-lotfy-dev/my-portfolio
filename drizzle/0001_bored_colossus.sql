ALTER TABLE "posts" RENAME COLUMN "title" TO "title_en";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "content" TO "content_en";--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "image_link" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "title_ar" text NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "content_ar" text NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "original_link" text NOT NULL;