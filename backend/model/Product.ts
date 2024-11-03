import { CategoryCodeStrings } from "../constants/categoryTypes"

export interface IProduct {
	id: string,
	name: string,
	description?: string,
	category: CategoryCodeStrings,
	price: number,
	createdAt: Date
}