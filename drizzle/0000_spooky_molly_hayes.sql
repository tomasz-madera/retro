CREATE TABLE `retro_boards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`status` enum('active','closed') NOT NULL DEFAULT 'active',
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`closed_at` timestamp,
	CONSTRAINT `retro_boards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `retro_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`column_id` int NOT NULL,
	`author_id` int NOT NULL,
	`content` text NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `retro_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `retro_columns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`board_id` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `retro_columns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `retro_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `retro_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `retro_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `retro_boards` ADD CONSTRAINT `retro_boards_created_by_retro_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `retro_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `retro_cards` ADD CONSTRAINT `retro_cards_column_id_retro_columns_id_fk` FOREIGN KEY (`column_id`) REFERENCES `retro_columns`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `retro_cards` ADD CONSTRAINT `retro_cards_author_id_retro_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `retro_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `retro_columns` ADD CONSTRAINT `retro_columns_board_id_retro_boards_id_fk` FOREIGN KEY (`board_id`) REFERENCES `retro_boards`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `retro_boards_status_idx` ON `retro_boards` (`status`);--> statement-breakpoint
CREATE INDEX `retro_boards_created_by_idx` ON `retro_boards` (`created_by`);--> statement-breakpoint
CREATE INDEX `retro_cards_column_id_idx` ON `retro_cards` (`column_id`);--> statement-breakpoint
CREATE INDEX `retro_cards_column_position_idx` ON `retro_cards` (`column_id`,`position`);--> statement-breakpoint
CREATE INDEX `retro_columns_board_id_idx` ON `retro_columns` (`board_id`);--> statement-breakpoint
CREATE INDEX `retro_columns_board_position_idx` ON `retro_columns` (`board_id`,`position`);--> statement-breakpoint
CREATE INDEX `retro_users_email_idx` ON `retro_users` (`email`);