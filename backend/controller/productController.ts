import { FastifyReply, FastifyRequest } from "fastify"
import { ProductServices } from "../services/productServices"
import { IProduct } from "../model/product"
import { validateCategory } from "../utils/categoryUtils"

export class ProductController {
  constructor(private productService: ProductServices) {
    this.productService = productService
  }

  // PUT /products
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const productData = req.body as IProduct
      const newProduct = await this.productService.createProduct(productData)
      reply.code(201).send(newProduct)
    } catch (error) {
      if (error instanceof Error) {
        reply.code(400).send({ error: error.message })
      } else {
        reply.code(500).send({ error: "An unexpected error occurred" })
      }
    }
  }


  // GET /products
  async index(req: FastifyRequest, reply: FastifyReply) {
    const { page = '1', limit = '10' } = req.query as { page?: string, limit?: string }
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)

    const { products, total } = await this.productService.findAllProducts(pageNumber, limitNumber)

    reply.send({
      products,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalItems: parseInt(total)
    })
  }

  //GET /products/:id
  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }

      const product = await this.productService.findProductById(id)

      if (product) {
        reply.send(product)
      } else {
        reply.code(404).send({ error: "Product not found" })
      }
    } catch (error) {
      reply.code(500).send({ error: "An unexpected error occurred" })
    }
  }

  //GET /products/search
  async getByName(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, page = '1', limit = '10' } = req.query as { name: string, page?: string, limit?: string }
      const pageNumber = parseInt(page)
      const limitNumber = parseInt(limit)

      const { products, total } = await this.productService.findProductsByName(name, pageNumber, limitNumber)

      reply.send({
        products,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalItems: parseInt(total)
      })
    } catch (error) {
      reply.code(500).send({ error: "An unexpected error occurred" })
    }
  }

  //GET /products/category/:category
  async getByCategory(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { category } = req.params as { category: string };
      const { page = '1', limit = '10' } = req.query as { page?: string, limit?: string };
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      let categoryCode = category;
      if (category.length > 1) {
        categoryCode = String(validateCategory(category));
        if (!categoryCode) {
          return reply.code(400).send({ error: "Invalid category" });
        }
      }

      const { products, total } = await this.productService.findProductsByCategory(categoryCode, pageNumber, limitNumber);

      reply.send({
        products,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalItems: parseInt(total)
      });
    } catch (error) {
      reply.code(500).send({ error: "An unexpected error occurred" });
    }
  }


  //PUT /products/:id
  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }
      const productData = req.body as Partial<IProduct>

      const updatedProduct = await this.productService.updateExistingProduct(id, productData)

      if (updatedProduct) {
        reply.send(updatedProduct)
      }

      reply.code(404).send({ error: "Product not found" })
    } catch (error) {
      if (error instanceof Error) {
        reply.code(400).send({ error: error.message })
      } else {
        reply.code(500).send({ error: "An unexpected error occurred" })
      }
    }
  }

  //DELETE /products/:id
  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string }

      const deleted = await this.productService.deleteProduct(id)

      if (deleted) {
        reply.code(204).send()
      } else {
        reply.code(404).send({ error: "Product not found" })
      }
    } catch (error) {
      reply.code(500).send({ error: "An unexpected error occurred" })
    }
  }
}