export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  image: string;
  category: string;
  promoCopy?: string;
  isNew?: boolean;
  tagline?: string;
}
