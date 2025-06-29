export interface Product {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
