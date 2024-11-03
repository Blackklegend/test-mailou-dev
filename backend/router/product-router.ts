import {FastifyInstance} from "fastify"
import * as db from "../db"
import {ProductController} from "../controller/product-controller"
import {ProductServices} from "../services/product-services"

export async function productRouter(fastify: FastifyInstance) {
	const productService = new ProductServices(db.loadProductRepository())
	const productController = new ProductController(productService)

	fastify.get("/products", productController.index.bind(productController))

	fastify.get(
		"/products/:id",
		productController.getById.bind(productController),
	)

	fastify.get(
		"/products/search",
		productController.getByName.bind(productController),
	)

	fastify.get(
		"/products/category/:category",
		productController.getByCategory.bind(productController),
	)

	fastify.put("/products", productController.create.bind(productController))

	fastify.put("/products/:id", productController.update.bind(productController))

	fastify.delete(
		"/products/:id",
		productController.delete.bind(productController),
	)
}
