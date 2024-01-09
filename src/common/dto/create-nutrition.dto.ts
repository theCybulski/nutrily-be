import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateNutritionDto {
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @IsNotEmpty()
  kcal: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @IsNotEmpty()
  carbs: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @IsNotEmpty()
  fat: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @IsNotEmpty()
  protein: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @IsOptional()
  fiber?: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @IsOptional()
  fe?: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @IsOptional()
  ca?: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @IsOptional()
  mg?: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @IsOptional()
  vitC?: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @IsOptional()
  vitK?: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @IsOptional()
  vitA?: number;
}
