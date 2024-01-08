import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateNutritionDto } from './update-nutrition.dto';

export class UpdateIngredientDto {
  @IsString()
  @IsOptional()
  name: string;

  @ValidateNested()
  @Type(() => UpdateNutritionDto)
  nutrition?: UpdateNutritionDto;
}
