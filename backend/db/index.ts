import pg from "pg"
import {ProductRepository} from "../repositories/product-repository"

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
})

export function loadProductRepository() {
	return new ProductRepository(pool)
}
