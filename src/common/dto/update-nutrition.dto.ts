import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateNutritionDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  kcal?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  carbs?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  fat?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  protein?: number;

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
