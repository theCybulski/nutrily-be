/*
  Warnings:

  - The primary key for the `substitute_ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `recipeIngredientIngredientId` to the `substitute_ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipeIngredientRecipeId` to the `substitute_ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "substitute_ingredient" DROP CONSTRAINT "substitute_ingredient_pkey",
ADD COLUMN     "recipeIngredientIngredientId" TEXT NOT NULL,
ADD COLUMN     "recipeIngredientRecipeId" TEXT NOT NULL,
ADD CONSTRAINT "substitute_ingredient_pkey" PRIMARY KEY ("recipeIngredientRecipeId", "recipeIngredientIngredientId", "ingredientId");

-- AddForeignKey
ALTER TABLE "substitute_ingredient" ADD CONSTRAINT "substitute_ingredient_recipeIngredientRecipeId_recipeIngre_fkey" FOREIGN KEY ("recipeIngredientRecipeId", "recipeIngredientIngredientId") REFERENCES "recipe_ingredients"("recipeId", "ingredientId") ON DELETE CASCADE ON UPDATE CASCADE;
