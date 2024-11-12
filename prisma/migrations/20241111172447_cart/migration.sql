/*
  Warnings:

  - You are about to drop the column `cartItems` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `cartTotol` on the `cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cart` DROP COLUMN `cartItems`,
    DROP COLUMN `cartTotol`;
