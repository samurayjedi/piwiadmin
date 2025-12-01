import { measurements } from '@/consts';
import { type Brand } from '../Brands/types';
import { type Category } from '../Categories/types';

export interface Product {
  id: number;
  barcode: string;
  name: string;
  price: number;
  profit: number;
  measurement: (typeof measurements)[number];
  stock: number;
  category: Category;
  brand: Brand;
  wholesale: boolean;
  wholesale_qty: number;
  wholesale_profit: number;
}
