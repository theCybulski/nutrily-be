import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  kcal: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  carbs: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  fat: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  protein: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  fiber?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  fe?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  ca?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  mg?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  vitC?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  vitK?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  vitA?: number;
}
