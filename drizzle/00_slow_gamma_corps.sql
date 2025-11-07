--> statement-breakpoint
CREATE TABLE `job_roles` (
	`id` integer PRIMARY KEY NOT NULL,
	`job_role_name` text NOT NULL,
	`description` text NOT NULL,
	`responsibilities` text NOT NULL,
	`job_spec_link` text NOT NULL,
	`location` text NOT NULL,
	`capability` text NOT NULL,
	`band` text NOT NULL,
	`closing_date` integer NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`number_of_open_positions` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`forename` text NOT NULL,
	`surname` text NOT NULL,
	`role` text DEFAULT 'Applicant' NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`last_login` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_users_email_unique` ON `auth_users` (`email`);
--> statement-breakpoint
CREATE TABLE `job_applications` (
	`id` integer PRIMARY KEY NOT NULL,
	`job_role_id` integer NOT NULL,
	`user_id` text,
	`applicant_name` text NOT NULL,
	`applicant_email` text NOT NULL,
	`cover_letter` text,
	`resume_url` text,
	`cv_data` text,
	`cv_file_name` text,
	`cv_mime_type` text,
	`status` text DEFAULT 'in progress' NOT NULL,
	`submitted_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`job_role_id`) REFERENCES `job_roles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `auth_users`(`user_id`) ON UPDATE no action ON DELETE no action
);