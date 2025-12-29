import { useMemo } from 'react';
import { useAppPage } from '@/hooks';
import { Cart } from '../types';

export function useImportedCart() {
  const { cart, recreated_sale } = useAppPage().props;
  const memoCart = useMemo(() => cart, []) as Cart;

  return { cart: memoCart, recreated_sale: recreated_sale as boolean };
}
