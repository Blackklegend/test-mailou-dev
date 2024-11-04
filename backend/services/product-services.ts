import {CategoryCode} from "../constants/category-types"
import {IProduct} from "../model/Product"
import {ProductRepository} from "../repositories/product-repository"
import {validateCategory} from "../utils/category-utils"

export class ProductServices {
	constructor(private productRepository: ProductRepository) {}

	async createProduct(product: IProduct): Promise<IProduct> {
		await this.validateProductData(product)
		const validatedProduct = {
			...product,
			category: this.validateCategory(product.category),
		}
		return await this.productRepository.create(validatedProduct)
	}

	async deleteProduct(id: string): Promise<boolean> {
		return await this.productRepository.deleteById(id)
	}

	async findAllProducts(page: number, limit: number) {
		return this.getPaginatedProducts(
			this.productRepository.findAll.bind(this.productRepository),
			page,
			limit,
		)
	}

	async findProductsByCategory(category: string, page: number, limit: number) {
		return this.getPaginatedProducts(
			this.productRepository.findByCategory.bind(
				this.productRepository,
				category,
			),
			page,
			limit,
		)
	}

	async findProductById(id: string) {
		return await this.productRepository.findById(id)
	}

	async findProductsByName(name: string, page: number, limit: number) {
		return this.getPaginatedProducts(
			this.productRepository.findByName.bind(this.productRepository, name),
			page,
			limit,
		)
	}

	async updateExistingProduct(
		productId: string,
		updatedProductData: Partial<IProduct>,
	): Promise<IProduct | null> {
		const existingProduct = await this.findProductById(productId)
		if (!existingProduct) {
			throw new Error("Product not found")
		}
		updatedProductData.id = existingProduct.id
		const validatedData = await this.validateUpdatedData(
			updatedProductData,
			existingProduct.category as CategoryCode,
		)
		return await this.productRepository.update(
			{...existingProduct, ...validatedData},
			productId,
		)
	}
	private validateCategory(category: string): CategoryCode {
		const validCategory = validateCategory(category)
		if (!validCategory) {
			throw new Error("Invalid category")
		}
		return validCategory
	}

	private async validateProductName(
		name: string,
		category: CategoryCode,
		id: string,
	): Promise<void> {
		const existingProduct = await this.productRepository.findByNameAndCategory(
			name,
			category,
		)
		if (existingProduct && !existingProduct.id.match(id)) {
			throw new Error("Nome já cadastrado na categoria, impossível alterar")
		}
	}

	private validateProductPrice(price: number): void {
		if (isNaN(price)) {
			throw new Error("Preço deve ser numérico")
		}
	}

	private async validateProductData(data: Partial<IProduct>): Promise<void> {
		const errors: string[] = []

		this.validateRequiredFields(data, errors)
		this.validatePrice(data.price, errors)
		this.validateProductCategory(data.category, errors)
		await this.validateProductUniqueness(data, errors)

		if (errors.length > 0) {
			throw new Error(errors.join(". "))
		}
	}

	private validateRequiredFields(
		data: Partial<IProduct>,
		errors: string[],
	): void {
		if (!data.price) errors.push("Preço não informado, item obrigatório")
		if (!data.name) errors.push("Nome não preenchido, item obrigatório")
		if (!data.category)
			errors.push("Categoria não preenchida, item obrigatório")
	}

	private validatePrice(price: number | undefined, errors: string[]): void {
		if (price !== undefined) {
			try {
				this.validateProductPrice(price)
			} catch (error) {
				errors.push(error instanceof Error ? error.message : String(error))
			}
		}
	}

	private validateProductCategory(
		category: string | undefined,
		errors: string[],
	): void {
		if (!category || category.trim() === "") {
			errors.push("Categoria não preenchida, item obrigatório")
			return
		}

		try {
			this.validateCategory(category)
		} catch (error) {
			console.error("Error validating category", error)
			errors.push("Categoria inválida")
		}
	}

	private async validateProductUniqueness(
		data: Partial<IProduct>,
		errors: string[],
	): Promise<void> {
		if (data.name && data.category) {
			const existingProduct =
				await this.productRepository.findByNameAndCategory(
					data.name,
					data.category,
				)
			if (existingProduct) {
				errors.push("Produto já existente na categoria")
			}
		}
	}

	private async validateUpdatedData(
		updatedData: Partial<IProduct>,
		currentCategory: CategoryCode,
	): Promise<Partial<IProduct>> {
		const validatedData: Partial<IProduct> = {}

		if (updatedData.category) {
			validatedData.category = this.validateCategory(updatedData.category)
		}

		if (updatedData.name && updatedData.id) {
			await this.validateProductName(
				updatedData.name,
				(validatedData.category as CategoryCode) || currentCategory,
				updatedData.id,
			)
			validatedData.name = updatedData.name
		}

		if (updatedData.price !== undefined) {
			this.validateProductPrice(updatedData.price)
			validatedData.price = updatedData.price
		}

		return validatedData
	}

	private async getPaginatedProducts(
		findMethod: (
			limit: number,
			offset: number,
		) => Promise<{products: IProduct[]; total: number}>,
		page: number,
		limit: number,
	) {
		const offset = (page - 1) * limit
		return await findMethod(limit, offset)
	}
}
