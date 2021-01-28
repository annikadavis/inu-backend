/*
  Warnings:

  - You are about to drop the column `cycleId` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Users` DROP FOREIGN KEY `users_ibfk_1`;

-- AlterTable
ALTER TABLE `Cycle` MODIFY `user_id` INT;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `cycleId`;

-- AddForeignKey
ALTER TABLE `Cycle` ADD FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
