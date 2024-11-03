import {FastifyReply, FastifyRequest} from "fastify"
import {ProductServices} from "../services/product-services"
import {IProduct} from "../model/Product"
import {validateCategory} from "../utils/category-utils"

const MAX_ITEMS_PER_PAGE = 500
const DEFAULT_PAGE = "1"
const DEFAULT_LIMIT = "10"
export class ProductController {
	constructor(private productService: ProductServices) {}

	async create(req: FastifyRequest, reply: FastifyReply) {
		try {
			const productData = req.body as IProduct
			const newProduct = await this.productService.createProduct(productData)
			reply.code(201).send(newProduct)
		} catch (error) {
			this.handleError(reply, error)
		}
	}

	async index(req: FastifyRequest, reply: FastifyReply) {
		const {page, limit} = this.getPaginationParams(req)

		if (this.isLimitExceeded(limit)) {
			return this.sendLimitExceededError(reply)
		}

		const {products, total} = await this.productService.findAllProducts(
			page,
			limit,
		)
		this.sendPaginatedResponse(reply, products, total, page, limit)
	}

	async getById(req: FastifyRequest, reply: FastifyReply) {
		try {
			const {id} = req.params as {id: string}
			const product = await this.productService.findProductById(id)

			if (!product) {
				return reply.code(404).send({error: "Produto não encontrado"})
			}

			reply.send(product)
		} catch (error) {
			this.handleError(reply, error)
		}
	}

	async getByName(req: FastifyRequest, reply: FastifyReply) {
		try {
			const {name} = req.query as {name: string}
			const {page, limit} = this.getPaginationParams(req)

			if (this.isLimitExceeded(limit)) {
				return this.sendLimitExceededError(reply)
			}

			const {products, total} = await this.productService.findProductsByName(
				name,
				page,
				limit,
			)
			this.sendPaginatedResponse(reply, products, total, page, limit)
		} catch (error) {
			this.handleError(reply, error)
		}
	}

	async getByCategory(req: FastifyRequest, reply: FastifyReply) {
		try {
			const {category} = req.params as {category: string}
			const {page, limit} = this.getPaginationParams(req)

			if (this.isLimitExceeded(limit)) {
				return this.sendLimitExceededError(reply)
			}

			const categoryCode = this.validateAndFormatCategory(category)
			if (!categoryCode) {
				return reply.code(400).send({error: "Categoria inválida"})
			}

			const {products, total} =
				await this.productService.findProductsByCategory(
					categoryCode,
					page,
					limit,
				)
			this.sendPaginatedResponse(reply, products, total, page, limit)
		} catch (error) {
			this.handleError(reply, error)
		}
	}

	async update(req: FastifyRequest, reply: FastifyReply) {
		try {
			const {id} = req.params as {id: string}
			const productData = req.body as Partial<IProduct>

			const updatedProduct = await this.productService.updateExistingProduct(
				id,
				productData,
			)

			if (!updatedProduct) {
				return reply.code(404).send({error: "Produto não encontrado"})
			}

			reply.send(updatedProduct)
		} catch (error) {
			this.handleError(reply, error)
		}
	}

	async delete(req: FastifyRequest, reply: FastifyReply) {
		try {
			const {id} = req.params as {id: string}
			const deleted = await this.productService.deleteProduct(id)

			if (!deleted) {
				return reply.code(404).send({error: "Produto não encontrado"})
			}

			reply.code(204).send()
		} catch (error) {
			this.handleError(reply, error)
		}
	}

	private handleError(reply: FastifyReply, error: unknown) {
		if (error instanceof Error) {
			reply.code(400).send({error: error.message})
		} else {
			reply.code(500).send({error: "Ocorreu um erro inesperado"})
		}
	}

	private getPaginationParams(req: FastifyRequest) {
		const {page = DEFAULT_PAGE, limit = DEFAULT_LIMIT} = req.query as {
			page?: string
			limit?: string
		}
		return {page: parseInt(page), limit: parseInt(limit)}
	}

	private isLimitExceeded(limit: number) {
		return limit > MAX_ITEMS_PER_PAGE
	}

	private sendLimitExceededError(reply: FastifyReply) {
		reply.code(400).send({
			error: `Não é permitido mais que ${MAX_ITEMS_PER_PAGE} items por página`,
		})
	}

	private sendPaginatedResponse(
		reply: FastifyReply,
		products: IProduct[],
		total: number,
		page: number,
		limit: number,
	) {
		reply.send({
			products,
			currentPage: page,
			totalPages: Math.ceil(total / limit),
			totalItems: parseInt(total.toString()),
		})
	}

	private validateAndFormatCategory(category: string) {
		let categoryCode = category.toUpperCase()
		if (category.length > 1) {
			categoryCode = String(validateCategory(category))
		}
		return categoryCode || null
	}
}
