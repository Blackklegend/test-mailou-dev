import { FastifyReply, FastifyRequest } from "fastify";
import { ProductServices } from "../services/productServices";

export class ProductController {
  constructor(private productService: ProductServices) { 
    this.productService = productService
  }

  // GET /products
  async index(req: FastifyRequest, reply: FastifyReply) {
    const { page = '1', limit = '10' } = req.query as { page?: string, limit?: string };
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const { products, total } = await this.productService.findAllProducts(pageNumber, limitNumber);

    reply.send({
      products,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalItems: total
    });
  }

  // PUT /products
  async create(req: FastifyRequest, reply: FastifyReply) {
    
  }


}