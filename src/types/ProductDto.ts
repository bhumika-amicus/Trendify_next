export interface ProductDto {
  productId: number;
  name: string | null;
  description: string | null;
  categoryId: number;
  categoryName: string | null;
  brandId: number;
  brandName: string | null;
  price: number;
  rating: number;
}
