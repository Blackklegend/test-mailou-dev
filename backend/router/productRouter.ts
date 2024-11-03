import { FastifyInstance } from 'fastify';
import * as db from "../db"
import { ProductController } from '../controller/productController';
import { ProductServices } from '../services/productServices';

export async function productRouter(fastify: FastifyInstance) {
  const productService = new ProductServices(db.loadProductRepository())
  const productController = new ProductController(productService);

  fastify.get('/products', productController.index.bind(productController));

  // Get a single product by ID
  // fastify.get('/products/:id', productController.getProductById);

  
  fastify.post('/products', productController.create.bind(productController));

  // // Update an existing product
  // fastify.put('/products/:id', productController.updateProduct);

  // // Delete a product
  // fastify.delete('/products/:id', productController.deleteProduct);
}