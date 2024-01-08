import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from '@prisma/client';

@Injectable()
export class IngredientsService {
  constructor(private dbService: DbService) {}

  getAll() {
    return this.dbService.ingredient.findMany({
      include: { nutrition: true },
    });
  }

  async getById(id: Ingredient['id']) {
    const ingredient = await this.dbService.ingredient.findFirst({
      where: { id },
      include: { nutrition: true },
    });

    if (!ingredient) throw new NotFoundException('Ingredient does not exist');

    return ingredient;
  }

  async getAllByIds(ids: Ingredient['id'][]) {
    const ingredients = await this.dbService.ingredient.findMany({
      where: { id: { in: ids } },
      include: { nutrition: true },
    });

    const existingIds = new Set(ingredients.map((ingredient) => ingredient.id));
    const notExisting = ids.filter((id) => !existingIds.has(id));

    if (notExisting.length > 0)
      throw new NotFoundException(
        `Following ingredients do not exist: ${notExisting.join(', ')}`,
      );

    return ingredients;
  }

  async create(dto: CreateIngredientDto) {
    if (!dto.nutrition)
      throw new BadRequestException('Ingredient must have nutrition');

    const { nutrition: nutritionDto, ...ingredientDto } = dto;

    try {
      const newIngredient = await this.dbService.ingredient.create({
        data: { ...ingredientDto, nutrition: { create: nutritionDto } },
        include: { nutrition: true },
      });

      return newIngredient;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ForbiddenException(
          'Ingredient with this name already exists',
        );
      }

      throw new BadRequestException();
    }
  }

  async update(id: Ingredient['id'], dto: UpdateIngredientDto) {
    const ingredient = await this.getById(id);

    const { nutrition: nutritionDto, ...ingredientDto } = dto;
    try {
      const updatedIngredient = await this.dbService.ingredient.update({
        where: { id: ingredient.id },
        data: { ...ingredientDto, nutrition: { update: nutritionDto } },
        include: { nutrition: true },
      });

      return updatedIngredient;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ForbiddenException(
          'Ingredient with this name already exists',
        );

      throw new BadRequestException();
    }
  }
}
