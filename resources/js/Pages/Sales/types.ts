export type Cart = Omit<Product, 'brand' | 'category'> & {
  brand: string;
  category: string;
  qty: number;
};
