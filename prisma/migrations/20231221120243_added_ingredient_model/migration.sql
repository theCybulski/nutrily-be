-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "kcal" INTEGER NOT NULL,
    "carbs" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "fiber" INTEGER,
    "fe" INTEGER,
    "ca" INTEGER,
    "mg" INTEGER,
    "vitC" INTEGER,
    "vitK" INTEGER,
    "vitA" INTEGER,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);
