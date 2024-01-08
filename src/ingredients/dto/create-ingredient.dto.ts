import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateNutritionDto } from './create-nutrition.dto';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => CreateNutritionDto)
  nutrition: CreateNutritionDto;
}
