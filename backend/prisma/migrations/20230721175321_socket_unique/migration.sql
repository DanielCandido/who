/*
  Warnings:

  - A unique constraint covering the columns `[socketClientId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user_socketClientId_key` ON `user`(`socketClientId`);
