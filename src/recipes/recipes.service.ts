import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { IngredientsService } from '../ingredients/ingredients.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { nutritionSelectSchema } from '../common/select-schemas/nutrition.select-schema';

@Injectable()
export class RecipesService {
  constructor(
    private dbService: DbService,
    private ingredientsService: IngredientsService,
  ) {}

  getAll() {
    return this.dbService.recipe.findMany({
      include: {
        nutrition: true,
        ingredients: true,
      },
    });
  }

  async create(dto: CreateRecipeDto) {
    const ingredientEntities = await this.ingredientsService.getAllByIds(
      dto.ingredients.map((ingredient) => ingredient.ingredientId),
    );
    const ingredientAmountMap = new Map(
      dto.ingredients.map((ingredient) => [
        ingredient.ingredientId,
        ingredient.amount,
      ]),
    );

    try {
      const recipe = await this.dbService.recipe.create({
        data: {
          name: dto.name,
          instructions: dto.instructions,
          preparationTime: dto.preparationTime,
          nutrition: { create: dto.nutrition },
          ingredients: {
            createMany: {
              data: ingredientEntities.map((ingredientEntity) => ({
                ingredientId: ingredientEntity.id,
                amount: ingredientAmountMap.get(ingredientEntity.id),
              })),
            },
          },
        },
        select: {
          id: true,
          name: true,
          instructions: true,
          preparationTime: true,
          nutrition: nutritionSelectSchema,
          ingredients: {
            select: {
              amount: true,
              ingredient: {
                select: {
                  id: true,
                  name: true,
                  measure: true,
                  nutrition: nutritionSelectSchema,
                },
              },
            },
          },
        },
      });

      // TODO: handle ingredient substitutes

      return recipe;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ForbiddenException('Recipe with this name already exists');
    }
  }
}
