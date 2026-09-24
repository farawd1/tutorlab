CREATE TABLE `enrollments` (
	`courseId` text NOT NULL,
	`userId` text NOT NULL,
	`createdAt` text NOT NULL,
	PRIMARY KEY(`courseId`, `userId`),
	FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `enrollments_user` ON `enrollments` (`userId`);--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`email` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`resetAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_sessions` (
	`tokenHash` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expiresAt` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `auth_sessions_user` ON `auth_sessions` (`userId`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`passwordHash` text NOT NULL,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `courses` ADD `teacherId` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `courses` ADD `inviteCode` text;--> statement-breakpoint
CREATE UNIQUE INDEX `courses_inviteCode_unique` ON `courses` (`inviteCode`);--> statement-breakpoint
ALTER TABLE `exam_sessions` ADD `userId` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `exam_sessions` ADD `examId` text;--> statement-breakpoint
ALTER TABLE `exam_sessions` ADD `endsAt` text;--> statement-breakpoint
CREATE INDEX `exam_sessions_exam_user` ON `exam_sessions` (`examId`,`userId`);--> statement-breakpoint
ALTER TABLE `submissions` ADD `studentId` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `submissions` ADD `sessionId` text;--> statement-breakpoint
CREATE INDEX `submissions_session` ON `submissions` (`sessionId`);--> statement-breakpoint
CREATE UNIQUE INDEX `submissions_exam_once` ON `submissions` (`sessionId`,`taskId`);