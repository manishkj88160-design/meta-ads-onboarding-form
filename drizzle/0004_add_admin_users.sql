CREATE TABLE `admin_users` (
  `id` int AUTO_INCREMENT NOT NULL,
  `adminId` varchar(255) NOT NULL UNIQUE,
  `passwordHash` varchar(255) NOT NULL,
  `name` varchar(255),
  `isActive` varchar(10) NOT NULL DEFAULT 'true',
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `admin_users_id` PRIMARY KEY(`id`)
);
