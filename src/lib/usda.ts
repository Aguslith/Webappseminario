/**
 * USDA FoodData Central API Utility
 */

const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY';
const SEARCH_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

export interface USDAFoodItem {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    unitName: string;
    value: number;
  }>;
}

export async function searchUSDAFood(query: string): Promise<USDAFoodItem[]> {
  try {
    const response = await fetch(`${SEARCH_URL}?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=5`);
    const data = await response.json();
    return data.foods || [];
  } catch (error) {
    console.error('Error searching USDA food:', error);
    return [];
  }
}

export function getMacroInfo(food: USDAFoodItem) {
  const calories = food.foodNutrients.find(n => n.nutrientName === 'Energy' || n.nutrientId === 1008)?.value || 0;
  const protein = food.foodNutrients.find(n => n.nutrientId === 1003 || n.nutrientName === 'Protein')?.value || 0;
  const carbs = food.foodNutrients.find(n => n.nutrientId === 1005 || n.nutrientName.includes('Carbohydrate'))?.value || 0;
  const fats = food.foodNutrients.find(n => n.nutrientId === 1004 || n.nutrientName.includes('Total lipid'))?.value || 0;

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats)
  };
}
