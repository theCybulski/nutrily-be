import { ForbiddenException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { DbService } from '../db/db.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { IngredientsService } from '../ingredients/ingredients.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { nutritionSelectSchema } from '../common/select-schemas/nutrition.select-schema';
import { CreateNutritionDto } from '../common/dto/create-nutrition.dto';
import { calculateNutritionValue } from '../common/utils/calculate-nutrition-value';

const nutritionDtoDefaultValues: CreateNutritionDto = {
  kcal: 0,
  carbs: 0,
  fat: 0,
  protein: 0,
  fiber: 0,
  fe: 0,
  ca: 0,
  mg: 0,
  vitC: 0,
  vitK: 0,
  vitA: 0,
};
const nutritionDtoKeys = Object.keys(nutritionDtoDefaultValues);

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
    const flattenedIngredients = this.flattenIngredients(dto.ingredients);
    const ingredientsLookupMap =
      this.createIngredientsLookupMap(flattenedIngredients);
    const ingredientEntities =
      await this.verifyIngredientsExist(ingredientsLookupMap);
    const nutritionDto: CreateNutritionDto = this.calculateNutrition(
      ingredientEntities,
      ingredientsLookupMap,
    );

    try {
      const recipe = await this.dbService.recipe.create({
        data: {
          name: dto.name,
          instructions: dto.instructions,
          preparationTime: dto.preparationTime,
          nutrition: { create: nutritionDto },
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

  private flattenIngredients(ingredients: CreateRecipeDto['ingredients']) {
    return ingredients.flatMap((ingredient) => {
      const mainIngredientData = {
        id: uuidv4(),
        ingredientId: ingredient.ingredientId,
        amount: ingredient.amount,
        substituteForId: null,
      };

      const substituteIngredientsData = (ingredient.substitutes || []).map(
        (subIngredient) => ({
          id: uuidv4(),
          ingredientId: subIngredient.ingredientId,
          amount: subIngredient.amount,
          substituteForId: mainIngredientData.id,
        }),
      );

      return [mainIngredientData, ...substituteIngredientsData];
    });
  }

  private createIngredientsLookupMap(
    flattenedIngredients: ReturnType<typeof this.flattenIngredients>,
  ) {
    return new Map(
      flattenedIngredients.map((ingredient) => [
        ingredient.ingredientId,
        ingredient,
      ]),
    );
  }

  private verifyIngredientsExist(
    ingredientsLookupMap: ReturnType<typeof this.createIngredientsLookupMap>,
  ) {
    return this.ingredientsService.getAllByIds(
      Array.from(ingredientsLookupMap.keys()),
    );
  }

  private calculateNutrition(
    ingredientEntities: Awaited<ReturnType<typeof this.verifyIngredientsExist>>,
    ingredientsLookupMap: ReturnType<typeof this.createIngredientsLookupMap>,
  ) {
    return ingredientEntities.reduce((acc, ingredient) => {
      const ingredientData = ingredientsLookupMap.get(ingredient.id);

      if (ingredientData.substituteForId) return acc; // skip substitutes

      return nutritionDtoKeys.reduce(
        (acc, key) => ({
          ...acc,
          [key]:
            acc[key] +
            calculateNutritionValue(
              ingredient.nutrition[key],
              ingredientData.amount,
            ),
        }),
        acc as { [key in keyof typeof acc]: number },
      );
    }, nutritionDtoDefaultValues);
  }
}
