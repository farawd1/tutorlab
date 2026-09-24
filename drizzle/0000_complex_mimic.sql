CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subject` text NOT NULL,
	`description` text NOT NULL,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exam_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`startedAt` text NOT NULL,
	`endedAt` text
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`courseId` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`fileKey` text,
	`fileName` text,
	`mime` text,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `lessons_course` ON `lessons` (`courseId`);--> statement-breakpoint
CREATE TABLE `proctor_events` (
	`id` text PRIMARY KEY NOT NULL,
	`sessionId` text NOT NULL,
	`kind` text NOT NULL,
	`detail` text NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`sessionId`) REFERENCES `exam_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `events_session` ON `proctor_events` (`sessionId`);--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`taskId` text NOT NULL,
	`answer` text NOT NULL,
	`language` text NOT NULL,
	`status` text NOT NULL,
	`review` text,
	`score` real,
	`comment` text,
	`judgeTokens` text,
	`createdAt` text NOT NULL,
	`gradedAt` text,
	FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `submissions_task` ON `submissions` (`taskId`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`courseId` text NOT NULL,
	`title` text NOT NULL,
	`statement` text NOT NULL,
	`kind` text NOT NULL,
	`maxScore` integer NOT NULL,
	`expected` text NOT NULL,
	`tolerance` real NOT NULL,
	`rubric` text NOT NULL,
	`tests` text NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `tasks_course` ON `tasks` (`courseId`);