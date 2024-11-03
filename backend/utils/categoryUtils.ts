import { CategoryCode, CategoryDescriptions } from '../constants/categoryTypes'

function isCategoryCode(code: string): code is CategoryCode {
  return Object.values(CategoryCode).includes(code as CategoryCode)
}

export function validateCategory(category: string): CategoryCode | null {
  return isCategoryCode(category) ? category : getCategoryCode(category)
}

export function getCategoryDescription(code: CategoryCode): string {
  return CategoryDescriptions[code] || "Unknown Category"
}

export function getCategoryCode(description: string): CategoryCode | null {
  const entry = Object.entries(CategoryDescriptions).find(([_, desc]) => desc.toLowerCase() === description.toLowerCase())
  return entry ? entry[0] as CategoryCode : null
}