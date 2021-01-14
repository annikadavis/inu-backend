/*
  Warnings:

  - You are about to drop the column `phase_id` on the `Suggestion` table. All the data in the column will be lost.
  - You are about to drop the column `quarter_id` on the `Therapy` table. All the data in the column will be lost.
  - You are about to drop the `Description` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `order_num` to the `Therapy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Description` DROP FOREIGN KEY `description_ibfk_1`;

-- AlterTable
ALTER TABLE `Suggestion` DROP COLUMN `phase_id`;

-- AlterTable
ALTER TABLE `Therapy` DROP COLUMN `quarter_id`,
    ADD COLUMN     `order_num` INT NOT NULL;

-- CreateTable
CREATE TABLE `Description_audio` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `therapyId` INT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- DropTable
DROP TABLE `Description`;

-- AddForeignKey
ALTER TABLE `Description_audio` ADD FOREIGN KEY (`therapyId`) REFERENCES `Therapy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
