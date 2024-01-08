// model Recipe {
//   name            String             @unique
//   instructions    String
//   preparationTime Int?
//     nutrition       Nutrition?
//       ingredients     RecipeIngredient[]
//
// @@map("recipes")
// }

import {
  ArrayMinSize,
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreateNutritionDto } from 'src/common/dto/create-nutrition.dto';

import { CreateRecipeIngredientDto } from './create-recipe-ingredient.dto';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @IsNumber()
  @IsPositive()
  preparationTime: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateNutritionDto)
  nutrition: CreateNutritionDto;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients: CreateRecipeIngredientDto[];
}
