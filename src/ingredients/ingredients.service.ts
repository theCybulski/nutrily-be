import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from '@prisma/client';

@Injectable()
export class IngredientsService {
  constructor(private dbService: DbService) {}

  async getAll() {
    const allIngredients = await this.dbService.ingredient.findMany();

    return allIngredients;
  }

  async create(dto: CreateIngredientDto) {
    try {
      const newIngredient = await this.dbService.ingredient.create({
        data: dto,
      });

      return newIngredient;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'Ingredient with this name already exists',
          );
        }
      }
    }
  }

  async update(id: Ingredient['id'], dto: UpdateIngredientDto) {
    const ingredient = await this.dbService.ingredient.findFirst({
      where: { id },
    });

    if (!ingredient) throw new BadRequestException('Ingredient does not exist');

    try {
      const updatedIngredient = await this.dbService.ingredient.update({
        where: { id },
        data: dto,
      });
      return updatedIngredient;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'Ingredient with this name already exists',
          );
        }
      }
    }
  }
}
