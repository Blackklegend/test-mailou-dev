import { IProduct } from '../model/product';
import { ProductRepository } from '../repositories/productRepository';

export class ProductServices {
  constructor(private productRepository: ProductRepository) { }

  private async validateProductData(data: Partial<IProduct>): Promise<string[]> {
    const errors: string[] = [];

    if (!data.price) {
      errors.push("Preço não informado, item obrigatório")
    }

    if (!data.name) {
      errors.push("Nome não preenchido, item obrigatório")
    }
    if (!data.category) {
      errors.push("Categoria não preenchida, item obrigatório")
    }

    const existingProduct = await this.productRepository.findByNameAndCategory(data.name!, data.category!)
    if (existingProduct) {
      errors.push("Produto já existente na categoria")
    }

    return errors
  }

  async createProduct(product: IProduct): Promise<IProduct> {
    const errors = await this.validateProductData(product)
    if (errors.length > 0) {
      throw new Error(errors.join(", "))
    }

    const products = await this.productRepository.create(product)

    return products
  }

  async deleteProduct(id: string): Promise<boolean> {
    return await this.productRepository.deleteById(id)
  }

  async findAllProducts(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const {products, total} = await this.productRepository.findAll(limit, offset);

    return { products, total };
  }


  async findProductsByCategory(category: string) {
    return await this.productRepository.findByCategory(category);
  }

  async findProductsById(id: string) {
    return await this.productRepository.findById(id)
  }

  async findProductsByName(name: string) {
    return await this.productRepository.findByName(name)
  }

  async updateProduct(product: IProduct): Promise<IProduct | null> {
    const { id, name, description, category, price } = product;
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

    if (category) {
      fieldNames.push("category")
      fields.push(category)
    }

    if (price) {
      fieldNames.push("price")
      fields.push(price)
    }

    return null;
  }
}