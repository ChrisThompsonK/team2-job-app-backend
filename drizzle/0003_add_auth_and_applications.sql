-- Add auth_users table for authentication
CREATE TABLE IF NOT EXISTS `auth_users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`forename` text NOT NULL,
	`surname` text NOT NULL,
	`role` text DEFAULT 'Applicant' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_login` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `auth_users_email_unique` ON `auth_users` (`email`);
--> statement-breakpoint

-- Add job_applications table
CREATE TABLE IF NOT EXISTS `job_applications` (
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
