// utils/categoryUtils.ts
import { CategoryCode, CategoryDescriptions } from '../constants/categoryTypes';

export function getCategoryDescription(code: CategoryCode): string {
  return CategoryDescriptions[code] || "Unknown Category";
}
