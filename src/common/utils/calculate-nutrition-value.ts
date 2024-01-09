export const calculateNutritionValue = (
  nutritionValue: number,
  amount: number,
) => {
  return (nutritionValue / 100) * amount;
};
