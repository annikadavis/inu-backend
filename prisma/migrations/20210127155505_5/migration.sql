/*
  Warnings:

  - You are about to drop the column `cycleId` on the `Users` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[user_id]` on the table `Cycle`. If there are existing duplicate values, the migration will fail.

*/
-- DropForeignKey
ALTER TABLE `Users` DROP FOREIGN KEY `users_ibfk_1`;

-- AlterTable
ALTER TABLE `Cycle` MODIFY `period_length` INT;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `cycleId`;

-- CreateIndex
CREATE UNIQUE INDEX `Cycle_user_id_unique` ON `Cycle`(`user_id`);

-- AddForeignKey
ALTER TABLE `Cycle` ADD FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
