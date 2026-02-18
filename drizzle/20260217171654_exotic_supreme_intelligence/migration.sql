CREATE TABLE "account" (
	"password" varchar(100) NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"id_categorie" integer,
	"name" varchar(255) NOT NULL,
	"type" varchar(120) NOT NULL,
	"payment" varchar(130) NOT NULL,
	"price" real NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"update_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goal" (
	"id" uuid PRIMARY KEY NOT NULL,
	"id_user" uuid,
	"name" varchar(150) NOT NULL,
	"value" real,
	"have" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"update_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(260) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"update_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_id_categorie_categories_id_fk" FOREIGN KEY ("id_categorie") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;