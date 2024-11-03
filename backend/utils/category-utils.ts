/* eslint-disable @typescript-eslint/no-unused-vars */
import {CategoryCode, CategoryDescriptions} from "../constants/category-types"

/**
 * Checks if a given string is a valid CategoryCode.
 * @param code The string to check.
 * @returns True if the code is a valid CategoryCode, false otherwise.
 */
function isCategoryCode(code: string): code is CategoryCode {
	return Object.values(CategoryCode).includes(code as CategoryCode)
}

/**
 * Validates a category string and returns the corresponding CategoryCode.
 * @param category The category string to validate.
 * @returns The CategoryCode if valid, null otherwise.
 */
export function validateCategory(category: string): CategoryCode | null {
	if (isCategoryCode(category)) {
		return category
	}
	return getCategoryCode(category)
}

/**
 * Gets the description for a given CategoryCode.
 * @param code The CategoryCode to get the description for.
 * @returns The category description or "Unknown Category" if not found.
 */
export function getCategoryDescription(code: CategoryCode): string {
	return CategoryDescriptions[code] ?? "Unknown Category"
}

/**
 * Gets the CategoryCode for a given category description.
 * @param description The category description to look up.
 * @returns The corresponding CategoryCode if found, null otherwise.
 */
export function getCategoryCode(description: string): CategoryCode | null {
	const normalizedDescription = description.toLowerCase()
	const entry = Object.entries(CategoryDescriptions).find(
		([_, desc]) => desc.toLowerCase() === normalizedDescription,
	)
	return entry ? (entry[0] as CategoryCode) : null
}
