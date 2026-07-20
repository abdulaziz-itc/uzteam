CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "calculator_rate_limits" (
	"ip_hash" varchar(255) PRIMARY KEY NOT NULL,
	"attempt_count" integer DEFAULT 1,
	"window_start" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calculator_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"locale" varchar(10) DEFAULT 'en',
	"ip_hash" varchar(255),
	"raw_input_features" text,
	"raw_input_problem" text,
	"raw_input_integrations" text,
	"generated_br_text" text,
	"extracted_tags" jsonb,
	"complexity" varchar(50),
	"min_price" numeric(15, 2),
	"max_price" numeric(15, 2),
	"estimated_days" integer,
	"lead_id" uuid,
	"pdf_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"company" varchar(255),
	"service_interest" varchar(255),
	"message" text,
	"source" varchar(50) DEFAULT 'contact_form',
	"status" varchar(50) DEFAULT 'new',
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_item_id" uuid,
	"image_url" text NOT NULL,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid,
	"title_uz" varchar(255) NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_ru" varchar(255) NOT NULL,
	"description_uz" text,
	"description_en" text,
	"description_ru" text,
	"problem_uz" text,
	"problem_en" text,
	"problem_ru" text,
	"solution_uz" text,
	"solution_en" text,
	"solution_ru" text,
	"results_uz" text,
	"results_en" text,
	"results_ru" text,
	"tech_tags" jsonb DEFAULT '[]'::jsonb,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category" varchar(100),
	"title_uz" varchar(255) NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_ru" varchar(255) NOT NULL,
	"excerpt_uz" text,
	"excerpt_en" text,
	"excerpt_ru" text,
	"body_uz" text,
	"body_en" text,
	"body_ru" text,
	"cover_image" text,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pricing_matrix" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"label" varchar(255),
	"value" numeric(15, 2) NOT NULL,
	"type" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pricing_matrix_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "pricing_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_uz" varchar(255) NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_ru" varchar(255) NOT NULL,
	"price" numeric(10, 2),
	"currency" varchar(10) DEFAULT 'USD',
	"features_uz" jsonb DEFAULT '[]'::jsonb,
	"features_en" jsonb DEFAULT '[]'::jsonb,
	"features_ru" jsonb DEFAULT '[]'::jsonb,
	"is_highlighted" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"icon" varchar(100),
	"title_uz" varchar(255) NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_ru" varchar(255) NOT NULL,
	"description_uz" text,
	"description_en" text,
	"description_ru" text,
	"features_uz" jsonb DEFAULT '[]'::jsonb,
	"features_en" jsonb DEFAULT '[]'::jsonb,
	"features_ru" jsonb DEFAULT '[]'::jsonb,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"address_uz" text,
	"address_en" text,
	"address_ru" text,
	"phone" varchar(50),
	"email" varchar(255),
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"role_uz" varchar(255),
	"role_en" varchar(255),
	"role_ru" varchar(255),
	"bio_uz" text,
	"bio_en" text,
	"bio_ru" text,
	"photo_url" text,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "calculator_submissions" ADD CONSTRAINT "calculator_submissions_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_images" ADD CONSTRAINT "portfolio_images_portfolio_item_id_portfolio_items_id_fk" FOREIGN KEY ("portfolio_item_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;