CREATE TABLE `job_applications` (
	`id` integer PRIMARY KEY NOT NULL,
	`job_role_id` integer NOT NULL,
	`applicant_name` text NOT NULL,
	`applicant_email` text NOT NULL,
	`cover_letter` text,
	`resume_url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`submitted_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`job_role_id`) REFERENCES `job_roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `application_submissions`;