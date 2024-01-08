import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Ingredient } from '@prisma/client';

export class CreateRecipeIngredientDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  ingredientId: Ingredient['id'];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  substitutes: Omit<CreateRecipeIngredientDto, 'substitutes'>[];
}
