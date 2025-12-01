import React, { RefObject, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { sell_types } from '@/consts';

export const CartContext = React.createContext<CartContextType>(null);
export function useCartContext() {
  const ctx = useContext(CartContext);
  if (ctx === null) {
    throw new Error('Cart Context is null!!');
  }

  return ctx;
}

export function useSaleTypesItems() {
  const { t } = useTranslation();
  const items: Record<string, string> = {};
  sell_types.forEach((slug) => {
    items[slug] = t(items[slug]);
  });

  return items;
}

export type CartContextType = RefObject<HTMLFormElement> | null;
