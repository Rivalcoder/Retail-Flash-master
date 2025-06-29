export interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  imageUrl?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  oldPrice?: number;
  promoCopy?: string;
  isNew?: boolean;
  tagline?: string;
}
