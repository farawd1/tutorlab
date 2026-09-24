CREATE TABLE `exams` (
	`id` text PRIMARY KEY NOT NULL,
	`courseId` text NOT NULL,
	`title` text NOT NULL,
	`durationMinutes` integer NOT NULL,
	`taskIds` text NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `exams_course` ON `exams` (`courseId`);