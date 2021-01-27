/*
  Warnings:

  - You are about to drop the column `order_num` on the `Therapy` table. All the data in the column will be lost.
  - You are about to drop the column `quarterId` on the `Therapy` table. All the data in the column will be lost.
  - You are about to drop the `Description_audio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quarter` table. If the table is not empty, all the data it contains will be lost.
  - The migration will add a unique constraint covering the columns `[order]` on the table `Therapy`. If there are existing duplicate values, the migration will fail.
  - Added the required column `order` to the `Therapy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Description_audio` DROP FOREIGN KEY `description_audio_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Therapy` DROP FOREIGN KEY `therapy_ibfk_1`;

-- AlterTable
ALTER TABLE `Therapy` DROP COLUMN `order_num`,
    DROP COLUMN `quarterId`,
    ADD COLUMN     `order` INT NOT NULL;

-- DropTable
DROP TABLE `Description_audio`;

-- DropTable
DROP TABLE `Quarter`;

-- CreateIndex
CREATE UNIQUE INDEX `Therapy.order_unique` ON `Therapy`(`order`);
