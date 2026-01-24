import { useMemo } from 'react';
import { useAppPage } from '@/hooks';
import { Cart, Sale } from '../types';

export function useImportedCart() {
  const { cart, recreated_sale } = useAppPage().props;
  const memoCart = useMemo(() => cart, []) as Cart;

  return { cart: memoCart, recreated_sale: recreated_sale as boolean };
}

export function useSale() {
  const { sale } = useAppPage().props;
  if (!sale) {
    throw new Error('Sale prop its not available in this context.');
  }

  return sale as Sale;
}
