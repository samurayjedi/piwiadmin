import { type Cart } from '../types';

export interface FormCart extends Omit<Cart, 'brand' | 'category'> {
  brand: string;
  category: string;
}
