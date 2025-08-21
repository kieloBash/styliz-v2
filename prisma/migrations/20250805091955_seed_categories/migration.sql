/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `item-categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "item-categories_name_key" ON "item-categories"("name");
