export interface Product {
  id: string;
  name: string;
  series: string;
  brand: 'NOTHING' | 'CMF';
  category: string;
  color: string;
  imageUrl: string;
  alt: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateProductDto = Partial<CreateProductDto>;

export interface ProductService {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(dto: CreateProductDto): Promise<Product>;
  update(id: string, dto: UpdateProductDto): Promise<Product>;
  delete(id: string): Promise<void>;
}

export interface ProductDetailFeature {
  label: string;
  title: string;
  description: string;
}

export interface ProductDetailImage {
  src: string;
  alt: string;
  caption: string;
}

export interface ProductDetailCopy {
  eyebrow: string;
  description: string;
  features: ProductDetailFeature[];
  storyImages: ProductDetailImage[];
}

export interface ProductDetailService {
  getForProduct(product: Product): Promise<ProductDetailCopy>;
}
