import { CategoryCode } from '../constants/categoryTypes'
import { IProduct } from '../model/product'
import { ProductRepository } from '../repositories/productRepository'
import { validateCategory } from '../utils/categoryUtils'

export class ProductServices {
  constructor(private productRepository: ProductRepository) { }

  private validateCategory(category: string): CategoryCode {
    const validCategory = validateCategory(category)
    if (!validCategory) {
      throw new Error("Invalid category")
    }
    return validCategory
  }

  private async validateProductName(name: string, category: CategoryCode): Promise<void> {
    const existingProduct = await this.productRepository.findByNameAndCategory(name, category)
    if (existingProduct) {
      throw new Error("Nome já cadastrado na categoria, impossível alterar")
    }
  }

  private validateProductPrice(price: number): void {
    if (isNaN(price)) {
      throw new Error("Preço deve ser numérico")
    }
  }

  private async validateProductData(data: Partial<IProduct>): Promise<string[]> {
    const errors: string[] = []

    if (!data.price) {
      errors.push("Preço não informado, item obrigatório")
      try {
        this.validateProductPrice(data.price!)
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error))
      }
    }

    if (!data.name) {
      errors.push("Nome não preenchido, item obrigatório")
    }

    if (!data.category) {
      errors.push("Categoria não preenchida, item obrigatório")
    }
    if (data.category && !this.validateCategory(data.category)) {
      errors.push("Categoria inválida")
    }

    const existingProduct = await this.productRepository.findByNameAndCategory(data.name!, data.category!)
    if (existingProduct) {
      errors.push("Produto já existente na categoria")
    }

    return errors
  }

  private async validateUpdatedData(updatedData: Partial<IProduct>, currentCategory: CategoryCode): Promise<Partial<IProduct>> {
    const validatedData: Partial<IProduct> = {}

    if (updatedData.category) {
      validatedData.category = this.validateCategory(updatedData.category)
    }

    if (updatedData.name) {
      await this.validateProductName(updatedData.name, validatedData.category as CategoryCode || currentCategory)
      validatedData.name = updatedData.name
    }

    if (updatedData.price !== undefined) {
      this.validateProductPrice(updatedData.price)
      validatedData.price = updatedData.price
    }

    return validatedData
  }

  async createProduct(product: IProduct): Promise<IProduct> {
    const errors = await this.validateProductData(product)
    if (errors.length > 0) {
      throw new Error(errors.join(". "))
    }

    const validatedCategory = this.validateCategory(product.category)

    const validatedProduct = {
      ...product,
      category: validatedCategory
    }

    const products = await this.productRepository.create(validatedProduct)

    return products
  }

  async deleteProduct(id: string): Promise<boolean> {
    return await this.productRepository.deleteById(id)
  }

  async findAllProducts(page: number, limit: number) {
    const offset = (page - 1) * limit
    const { products, total } = await this.productRepository.findAll(limit, offset)

    return { products, total }
  }


  async findProductsByCategory(category: string, page: number, limit: number) {
    const offset = (page - 1) * limit
    return await this.productRepository.findByCategory(category, limit, offset)
  }

  async findProductById(id: string) {
    return await this.productRepository.findById(id)
  }

  async findProductsByName(name: string, page: number, limit: number) {
    const offset = (page - 1) * limit
    return await this.productRepository.findByName(name, limit, offset)
  }

  async updateExistingProduct(productId: string, updatedProductData: Partial<IProduct>): Promise<IProduct | null> {
    const existingProduct = await this.findProductById(productId)
    if (!existingProduct) {
      throw new Error("Product not found")
    }
    const validatedData = await this.validateUpdatedData(updatedProductData, existingProduct.category as CategoryCode)

    const updatedProduct = {
      ...existingProduct,
      ...validatedData,
    }

    return await this.productRepository.update(updatedProduct, productId)
  }
}