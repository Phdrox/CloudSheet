CREATE TABLE "account" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(300) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" integer PRIMARY KEY,
	"type_categorie" varchar(50) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY,
	"id_categorie" integer,
	"name" varchar(255) NOT NULL,
	"type" varchar(120) NOT NULL,
	"payment" varchar(130) NOT NULL,
	"price" real NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goal" (
	"id" uuid PRIMARY KEY,
	"id_user" uuid,
	"id_categories" integer,
	"name" varchar(150) NOT NULL,
	"value" real,
	"have" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"username" varchar(100) NOT NULL UNIQUE,
	"email" varchar(260) NOT NULL UNIQUE,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_id_categorie_category_id_fkey" FOREIGN KEY ("id_categorie") REFERENCES "category"("id");--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_id_user_users_id_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_id_categories_category_id_fkey" FOREIGN KEY ("id_categories") REFERENCES "category"("id");