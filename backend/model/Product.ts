import { Pool } from "pg"
import { v4 as uuid } from "uuid"

interface product {
	id: typeof uuid,
	name: string,
	description?: string,
	category: string,
	price: number,
	createdAt: Date
}

export class ProductModel {
	private pool: Pool;

	constructor(pool: Pool){
		this.pool = pool
	}

	async create(product: product): Promise<ProductModel> {
		const {name, description, category, price } = product;
		const res = await this.pool.query(
				"INSERT INTO products (name, description, category, price) values ($1, $2, $3, $4) RETURNING *",
				[name, description, category, price]
		)

		return res.rows[0]
	}

	async findById(id: number): Promise<ProductModel | null> {
			const res = await this.pool.query("SELECT * FROM products WHERE id = $1", [id])
			return res.rows.length ? res.rows[0] : null
	}

	async findAll(): Promise<ProductModel[]> {
		const res = await this.pool.query('SELECT * FROM products');
		return res.rows;
	}

	async update(product: product): Promise<ProductModel | null> {
		const {name, description, category, price} = product;
		let fieldNames = []
		let fields = []

		if (name) {
			fieldNames.push("name")
			fields.push(name)
		}

		if (description) {
			fieldNames.push("description")
			fields.push(description)
		}

		if(category){
			fieldNames.push("category")
			fields.push(category)
		}

		if(price){
			fieldNames.push("price")
			fields.push(price)
		}

		if(fields.length > 0) {
			const res = await this.pool.query(
					`UPDATE products SET (${fieldNames.join(",")}) values (${new Array(fieldNames.length).fill(`$${fieldNames.length}`)}) RETURNING *`,
					fields
			)
			return res.rows[0]
		}

		return null;
	}

	async delete(id: number): Promise<void> {
		await this.pool.query('DELETE FROM products WHERE id = $1', [id]);
	}
}