/*
  Warnings:

  - The primary key for the `recipe_ingredients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `substitute_ingredient` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[recipeId,ingredientId]` on the table `recipe_ingredients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId,ingredientId,substituteForId]` on the table `recipe_ingredients` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `recipe_ingredients` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "substitute_ingredient" DROP CONSTRAINT "substitute_ingredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "substitute_ingredient" DROP CONSTRAINT "substitute_ingredient_recipeIngredientRecipeId_recipeIngre_fkey";

-- AlterTable
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "substituteForId" TEXT,
ADD CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "substitute_ingredient";

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ingredients_recipeId_ingredientId_key" ON "recipe_ingredients"("recipeId", "ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ingredients_recipeId_ingredientId_substituteForId_key" ON "recipe_ingredients"("recipeId", "ingredientId", "substituteForId");

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_substituteForId_fkey" FOREIGN KEY ("substituteForId") REFERENCES "recipe_ingredients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
