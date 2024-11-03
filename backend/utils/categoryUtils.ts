import { CategoryCode, CategoryDescriptions } from '../constants/categoryTypes';

export function getCategoryDescription(code: CategoryCode): string {
  return CategoryDescriptions[code] || "Unknown Category";
}

function isCategoryCode(code: string): code is CategoryCode {
  return Object.values(CategoryCode).includes(code as CategoryCode);
}

export function validateCategory(category: string): CategoryCode | null {
  return isCategoryCode(category) ? category : null;
}