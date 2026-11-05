/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} series
 * @property {'NOTHING' | 'CMF'} brand
 * @property {string} category
 * @property {string} color
 * @property {string} imageUrl Relative image path; image bytes are not stored.
 * @property {string} alt
 * @property {number} order
 * @property {string} createdAt ISO 8601 timestamp.
 * @property {string} updatedAt ISO 8601 timestamp.
 */

/**
 * @typedef {Omit<Product, 'id' | 'createdAt' | 'updatedAt'>} CreateProductDto
 */

/**
 * @typedef {Partial<CreateProductDto>} UpdateProductDto
 */

/**
 * @typedef {Object} ProductService
 * @property {() => Promise<Product[]>} getAll
 * @property {(id: string) => Promise<Product | null>} getById
 * @property {(dto: CreateProductDto) => Promise<Product>} create
 * @property {(id: string, dto: UpdateProductDto) => Promise<Product>} update
 * @property {(id: string) => Promise<void>} delete
 */
