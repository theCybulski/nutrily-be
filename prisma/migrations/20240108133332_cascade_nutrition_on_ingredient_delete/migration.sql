-- DropForeignKey
ALTER TABLE "nutritions" DROP CONSTRAINT "nutritions_ingredientId_fkey";

-- AddForeignKey
ALTER TABLE "nutritions" ADD CONSTRAINT "nutritions_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
