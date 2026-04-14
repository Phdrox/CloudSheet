CREATE TABLE IF NOT EXISTS "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"type" varchar(10) NOT NULL,
	"role" varchar(12) NOT NULL,
	"token" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "account_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ispb" varchar(8) NOT NULL,
	"compe_code" varchar(3),
	"name" varchar NOT NULL,
	CONSTRAINT "banks_ispb_unique" UNIQUE("ispb")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type_categorie" varchar(50) NOT NULL,
	CONSTRAINT "category_type_categorie_unique" UNIQUE("type_categorie")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_categories" varchar,
	"id_account" uuid NOT NULL,
	"id_name_banks" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(120) NOT NULL,
	"payment" varchar(130) NOT NULL,
	"price" varchar NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_account" uuid,
	"name" varchar(150) NOT NULL,
	"value" varchar,
	"have" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flows" ADD CONSTRAINT "flows_id_categories_category_type_categorie_fk" FOREIGN KEY ("id_categories") REFERENCES "public"."category"("type_categorie") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flows" ADD CONSTRAINT "flows_id_account_account_id_fk" FOREIGN KEY ("id_account") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flows" ADD CONSTRAINT "flows_id_name_banks_banks_id_fk" FOREIGN KEY ("id_name_banks") REFERENCES "public"."banks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal" ADD CONSTRAINT "goal_id_account_account_id_fk" FOREIGN KEY ("id_account") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
