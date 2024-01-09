/*
  Warnings:

  - A unique constraint covering the columns `[recipeId]` on the table `nutritions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `measure` to the `ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Measure" AS ENUM ('GRAMS', 'MILILITERS');

-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "measure" "Measure" NOT NULL;

-- AlterTable
ALTER TABLE "nutritions" ADD COLUMN     "recipeId" TEXT;

-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "preparationTime" INTEGER,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "amount" DOUBLE PRECISION NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("recipeId","ingredientId")
);

-- CreateTable
CREATE TABLE "substitute_ingredient" (
    "amount" DOUBLE PRECISION NOT NULL,
    "ingredientId" TEXT NOT NULL,

    CONSTRAINT "substitute_ingredient_pkey" PRIMARY KEY ("ingredientId")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipes_name_key" ON "recipes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "nutritions_recipeId_key" ON "nutritions"("recipeId");

-- AddForeignKey
ALTER TABLE "nutritions" ADD CONSTRAINT "nutritions_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substitute_ingredient" ADD CONSTRAINT "substitute_ingredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
