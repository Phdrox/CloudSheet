ALTER TABLE "goal" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "goal" DROP COLUMN "updateAt";--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_type_categorie_key" UNIQUE("type_categorie");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_key" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE("email");