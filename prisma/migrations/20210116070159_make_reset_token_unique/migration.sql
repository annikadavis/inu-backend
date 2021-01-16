/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[reset_token]` on the table `Password_reset`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Password_reset.reset_token_unique` ON `Password_reset`(`reset_token`);
