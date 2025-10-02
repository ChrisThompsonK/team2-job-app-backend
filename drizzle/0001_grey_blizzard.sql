CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`location` text,
	`description` text,
	`requirements` text,
	`salary_min` real,
	`salary_max` real,
	`salary_currency` text DEFAULT 'USD',
	`type` text DEFAULT 'full-time',
	`remote` integer DEFAULT false,
	`date_posted` text,
	`application_url` text,
	`status` text DEFAULT 'open',
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
