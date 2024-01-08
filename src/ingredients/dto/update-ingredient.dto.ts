import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateNutritionDto } from './update-nutrition.dto';
import { Measure } from '@prisma/client';

export class UpdateIngredientDto {
  @IsString()
  @IsOptional()
  name: string;

  @ValidateNested()
  @Type(() => UpdateNutritionDto)
  nutrition?: UpdateNutritionDto;

  @IsEnum(Measure)
  @IsOptional()
  measure: Measure;
}
