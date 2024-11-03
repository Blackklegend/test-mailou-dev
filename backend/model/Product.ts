import {CategoryCodeStrings} from "../constants/category-types"

export interface IProduct {
	id: string
	name: string
	description?: string
	category: CategoryCodeStrings
	price: number
	createdAt: Date
}
