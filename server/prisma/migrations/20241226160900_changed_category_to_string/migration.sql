/*
  Warnings:

  - The `categories` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "categories",
ADD COLUMN     "categories" TEXT;

-- DropEnum
DROP TYPE "Category";
