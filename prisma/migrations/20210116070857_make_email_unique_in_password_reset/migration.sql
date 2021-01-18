/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[email]` on the table `Password_reset`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Password_reset.email_unique` ON `Password_reset`(`email`);
