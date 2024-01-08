/*
  Warnings:

  - You are about to drop the column `ca` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `carbs` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `fat` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `fe` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `fiber` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `kcal` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `mg` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `protein` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `vitA` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `vitC` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `vitK` on the `ingredients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "ca",
DROP COLUMN "carbs",
DROP COLUMN "fat",
DROP COLUMN "fe",
DROP COLUMN "fiber",
DROP COLUMN "kcal",
DROP COLUMN "mg",
DROP COLUMN "protein",
DROP COLUMN "vitA",
DROP COLUMN "vitC",
DROP COLUMN "vitK";

-- CreateTable
CREATE TABLE "nutritions" (
    "id" TEXT NOT NULL,
    "kcal" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION,
    "fe" DOUBLE PRECISION,
    "ca" DOUBLE PRECISION,
    "mg" DOUBLE PRECISION,
    "vitC" DOUBLE PRECISION,
    "vitK" DOUBLE PRECISION,
    "vitA" DOUBLE PRECISION,
    "ingredientId" TEXT,

    CONSTRAINT "nutritions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nutritions_ingredientId_key" ON "nutritions"("ingredientId");

-- AddForeignKey
ALTER TABLE "nutritions" ADD CONSTRAINT "nutritions_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
