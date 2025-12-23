/*
  Warnings:

  - A unique constraint covering the columns `[product_id,user_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "likes_product_id_user_id_key" ON "likes"("product_id", "user_id");
