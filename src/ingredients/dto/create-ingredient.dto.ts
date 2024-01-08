import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateNutritionDto } from './create-nutrition.dto';
import { Measure } from '@prisma/client';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => CreateNutritionDto)
  nutrition: CreateNutritionDto;

  @IsEnum(Measure)
  measure: Measure;
}
