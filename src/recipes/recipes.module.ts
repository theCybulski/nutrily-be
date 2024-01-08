import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { IngredientsService } from '../ingredients/ingredients.service';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, IngredientsService],
})
export class RecipesModule {}
