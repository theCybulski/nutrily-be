import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from '@prisma/client';

@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @Get()
  getAll() {
    return this.ingredientsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: Ingredient['id']) {
    return this.ingredientsService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateIngredientDto) {
    return this.ingredientsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: Ingredient['id'], @Body() dto: UpdateIngredientDto) {
    return this.ingredientsService.update(id, dto);
  }
}
