import {Pool} from "pg"
import {IProduct} from "../model/Product"

export class ProductRepository {
	private pool: Pool

	constructor(pool: Pool) {
		this.pool = pool
	}

	async create(product: IProduct): Promise<IProduct> {
		const {name, description, category, price} = product
		const query = `
				INSERT INTO products (name, description, category, price) 
				VALUES ($1, $2, $3, $4) 
				RETURNING *`
		const values = [name, description, category, price]

		const result = await this.executeQuery(
			query,
			values,
			"Error creating product",
		)
		if (result === null) {
			throw new Error("Failed to create product")
		}
		return result
	}

	async findById(id: string): Promise<IProduct | null> {
		const query = `
      SELECT * FROM products
      WHERE id = $1
      LIMIT 1`

		return this.executeQuery(query, [id], "Error finding product by ID")
	}

	async findByCategory(category: string, limit: number, offset: number) {
		return this.findWithPagination(
			"category",
			category,
			limit,
			offset,
			"Error finding products by category",
		)
	}

	async findByName(name: string, limit: number, offset: number) {
		return this.findWithPagination(
			"name",
			name,
			limit,
			offset,
			"Error finding products by name",
		)
	}

	async findByNameAndCategory(
		name: string,
		category: string,
	): Promise<IProduct | null> {
		const query = `
      SELECT * FROM products
      WHERE name = $1 AND category = $2 
      LIMIT 1`
		const values = [name, category]

		return this.executeQuery(
			query,
			values,
			"Error finding product by name and category",
		)
	}

	async findAll(limit: number, offset: number) {
		const query = `
      SELECT *, COUNT(*) OVER() AS full_count 
      FROM products
      LIMIT $1 OFFSET $2`
		const values = [limit, offset]

		return this.executePaginatedQuery(
			query,
			values,
			"Error finding all products",
		)
	}

	async update(
		product: Partial<IProduct>,
		id: string,
	): Promise<IProduct | null> {
		const {query, values} = this.buildUpdateQuery(product, id)
		return this.executeQuery(query, values, "Error updating product")
	}

	async deleteById(id: string): Promise<boolean> {
		const query = `
      DELETE FROM products 
      WHERE id = $1 
      RETURNING id`

		const result = await this.executeQuery(
			query,
			[id],
			"Error deleting product",
		)
		return !!result
	}

	private async executeQuery(
		query: string,
		values: unknown[],
		errorMessage: string,
	): Promise<IProduct | null> {
		try {
			const result = await this.pool.query(query, values)
			return result.rows[0] || null
		} catch (error) {
			console.error(`${errorMessage}:`, error)
			throw new Error(errorMessage)
		}
	}

	private async executePaginatedQuery(
		query: string,
		values: unknown[],
		errorMessage: string,
	) {
		try {
			const res = await this.pool.query(query, values)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const products = res.rows.map(({full_count, ...product}) => product)
			const total = res.rows.length > 0 ? parseInt(res.rows[0].full_count) : 0
			return {products, total}
		} catch (error) {
			console.error(`${errorMessage}:`, error)
			throw new Error(errorMessage)
		}
	}

	private async findWithPagination(
		field: string,
		value: string,
		limit: number,
		offset: number,
		errorMessage: string,
	) {
		const query = `
      SELECT *, COUNT(*) OVER() AS full_count 
      FROM products 
      WHERE ${field} = $1
      LIMIT $2 OFFSET $3`
		const values = [value, limit, offset]

		return this.executePaginatedQuery(query, values, errorMessage)
	}

	private buildUpdateQuery(
		product: Partial<IProduct>,
		id: string,
	): {query: string; values: unknown[]} {
		const fieldNames = Object.keys(product)
		const values = Object.values(product)
		const setClause = fieldNames
			.map((field, index) => `${field} = $${index + 1}`)
			.join(", ")

		const query = `
      UPDATE products 
      SET ${setClause} 
      WHERE id = $${fieldNames.length + 1} 
      RETURNING *`

		return {query, values: [...values, id]}
	}
}
