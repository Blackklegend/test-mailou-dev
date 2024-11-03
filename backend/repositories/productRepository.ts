import { Pool } from "pg"
import { IProduct } from "../model/product"

export class ProductRepository {
	private pool: Pool

	constructor(pool: Pool) {
		this.pool = pool
	}

	async create(product: IProduct): Promise<IProduct> {
		const { name, description, category, price } = product

		const query = `
				INSERT INTO products 
				(name, description, category, price) 
				VALUES ($1, $2, $3, $4) 
				RETURNING *`

		try {
			const res = await this.pool.query(query, [name, description, category, price])
			return res.rows[0]
		} catch (error) {
			console.error('Error creating product:', error)
			throw error // or handle it as per your error handling strategy
		}
	}

	async findById(id: string): Promise<IProduct | null> {
		const query = `
				SELECT *
				FROM products
				WHERE id = $1
				LIMIT 1`

		try {
			const { rows } = await this.pool.query<IProduct>(query, [id])
			return rows[0] || null
		} catch (error) {
			console.error('Error finding product by ID:', error)
			throw new Error('Failed to retrieve product')
		}
	}

	async findByCategory(category: string, limit: number, offset: number) {
		const query = `
			SELECT 
				*,
				COUNT (*) OVER() AS full_count 
			FROM products 
			WHERE category = $1
			LIMIT $2
			OFFSET $3`

		const params = [category, limit, offset]

		try {
			const res = await this.pool.query(query, params)
			const products = res.rows.map(({ full_count, ...product }) => product)
			return { products, total: res.rows.length > 0 ? res.rows[0].full_count : 0 }
		} catch (error) {
			console.error('Error finding products by category:', error)
			throw new Error('Failed to retrieve products by category')
		}
	}

	async findByName(name: string, limit: number, offset: number) {
		const query = `
			SELECT 
				*,
				COUNT (*) OVER() AS full_count 
			FROM products 
			WHERE name = $1
			LIMIT $2
			OFFSET $3`

		const params = [name, limit, offset]

		try {
			const res = await this.pool.query(query, params)
			const products = res.rows.map(({ full_count, ...product }) => product)
			return { products, total: res.rows.length > 0 ? res.rows[0].full_count : 0 }
		} catch (error) {
			console.error('Error finding products by name:', error)
			throw new Error('Failed to retrieve products by name')
		}
	}

	async findByNameAndCategory(name: string, category: string): Promise<IProduct | null> {
		const query = `
			SELECT * 
			FROM products
			WHERE name = $1 
			AND category = $2 
			LIMIT 1`

		const params = [name, category]

		try {
			const { rows } = await this.pool.query<IProduct>(query, params)
			return rows[0] || null
		} catch (error) {
			console.error('Error finding product by name and category:', error)
			throw new Error('Failed to retrieve product by name and category')
		}
	}

	async findAll(limit: number, offset: number) {
		const query = `
			SELECT 
				* ,
				COUNT(*) OVER() AS full_count 
			FROM products
			LIMIT $1
			OFFSET $2`

		const res = await this.pool.query(query, [limit, offset])
		const products = res.rows.map(({ full_count, ...product }) => product)
		return { products, total: res.rows.length > 0 ? res.rows[0].full_count : 0 }
	}

	async update(product: IProduct, id: string): Promise<IProduct | null> {
		const fieldNames = Object.keys(product)
		const values = Object.values(product)
		const setClause = fieldNames
			.map((field, index) => `${field} = $${index + 1}`)
			.join(', ')

		const query = `
				UPDATE products 
				SET ${setClause} 
				WHERE id = $${fieldNames.length + 1} 
				RETURNING *`

		try {
			const res = await this.pool.query(query, [...values, id])
			return res.rows[0] || null
		} catch (error) {
			console.error('Error updating product:', error)
			throw new Error('Failed to update product')
		}
	}

	async deleteById(id: string): Promise<boolean> {
		const query = `
			DELETE FROM products 
			WHERE id = $1 
			RETURNING id`

		try {
			const result = await this.pool.query(query, [id])
			return result.rowCount! > 0
		} catch (error) {
			console.error('Error deleting product:', error)
			throw new Error('Failed to delete product')
		}
	}
}