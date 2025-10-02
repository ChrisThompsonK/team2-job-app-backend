CREATE TABLE `job_roles` (
	`id` integer PRIMARY KEY NOT NULL,
	`job_role_id` integer NOT NULL,
	`role_name` text NOT NULL,
	`description` text NOT NULL,
	`responsibilities` text NOT NULL,
	`job_spec_link` text NOT NULL,
	`location` text NOT NULL,
	`capability` text NOT NULL,
	`band` text NOT NULL,
	`closing_date` text NOT NULL,
	`status` text NOT NULL,
	`number_of_open_positions` integer NOT NULL
);
