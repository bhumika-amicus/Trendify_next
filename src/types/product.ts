export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  category: string;
  brandId: number;
  brand: string;
  rating: number;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  icon?: string;
}
