DROP TABLE "account";--> statement-breakpoint
DROP TABLE "session";--> statement-breakpoint
DROP TABLE "verificationToken";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" text NOT NULL;