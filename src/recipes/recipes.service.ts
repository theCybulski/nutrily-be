import { ForbiddenException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { DbService } from '../db/db.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { IngredientsService } from '../ingredients/ingredients.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { nutritionSelectSchema } from '../common/select-schemas/nutrition.select-schema';

const RecipeSelectSchema = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  instructions: true,
  preparationTime: true,
  nutrition: nutritionSelectSchema,
  ingredients: {
    where: { substituteForId: null }, // only main ingredients
    select: {
      amount: true,
      ingredient: {
        select: {
          id: true,
          name: true,
          measure: true,
        },
      },
      substitutes: {
        select: {
          amount: true,
          ingredient: {
            select: {
              id: true,
              name: true,
              measure: true,
            },
          },
        },
      },
    },
  },
};

@Injectable()
export class RecipesService {
  constructor(
    private dbService: DbService,
    private ingredientsService: IngredientsService,
  ) {}

  getAll() {
    return this.dbService.recipe.findMany({
      select: RecipeSelectSchema,
    });
  }

  async create(dto: CreateRecipeDto) {
    const flattenedIngredients = dto.ingredients.flatMap((mainIngredient) => {
      const mainIngredientData = {
        id: uuidv4(),
        ingredientId: mainIngredient.ingredientId,
        amount: mainIngredient.amount,
        substituteForId: null,
      };

      const substituteIngredientsData = mainIngredient.substitutes.map(
        (subIngredient) => ({
          id: uuidv4(),
          ingredientId: subIngredient.ingredientId,
          amount: subIngredient.amount,
          substituteForId: mainIngredientData.id,
        }),
      );

      return [mainIngredientData, ...substituteIngredientsData];
    });

    const ingredientsLookupMap = new Map(
      flattenedIngredients.map((ingredient) => [
        ingredient.ingredientId,
        ingredient,
      ]),
    );

    const ingredientEntities = await this.ingredientsService.getAllByIds(
      Array.from(ingredientsLookupMap.keys()),
    );

    try {
      const recipe = await this.dbService.recipe.create({
        data: {
          name: dto.name,
          instructions: dto.instructions,
          preparationTime: dto.preparationTime,
          // nutrition: { create: dto.nutrition }, // TODO: calculate nutrition from ingredients
          ingredients: {
            createMany: {
              data: ingredientEntities.map((ingredient) => {
                const ingredientData = ingredientsLookupMap.get(ingredient.id);

                return {
                  id: ingredientData.id,
                  amount: ingredientData.amount,
                  ingredientId: ingredientData.ingredientId,
                  substituteForId: ingredientData.substituteForId,
                };
              }),
            },
          },
        },
        select: RecipeSelectSchema,
      });

      return recipe;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ForbiddenException('Recipe with this name already exists');

      throw e;
    }
  }
}
