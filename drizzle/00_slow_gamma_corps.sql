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