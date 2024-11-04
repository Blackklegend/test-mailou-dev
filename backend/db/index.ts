import pg from "pg"
import {ProductRepository} from "../repositories/product-repository"

export function loadProductRepository() {
	const pool = new pg.Pool({
		connectionString: process.env.DATABASE_URL,
	})
	
	pool.on('error', (err) => {
		console.error('Unexpected error on idle client', err);
		process.exit(-1);
	});
	
	return new ProductRepository(pool)
}
