CREATE TABLE IF NOT EXISTS `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`category` varchar(40) NOT NULL,
	`price` int NOT NULL,
	`image` text NOT NULL,
	`tag` varchar(40) NOT NULL DEFAULT 'READY',
	`description` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `storefront_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceOverride` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storefront_settings_id` PRIMARY KEY(`id`)
);
