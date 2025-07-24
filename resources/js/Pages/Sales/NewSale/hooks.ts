import React, { RefObject, useContext, useMemo } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { type PaymentMethod } from '@/Pages/PaymentMethods';
import { Cart } from './SearchProductDialog';

export const CartContext = React.createContext<CartContextType>(null);
export function useCartContext() {
  const ctx = useContext(CartContext);
  if (ctx === null) {
    throw new Error('Cart Context is null!!');
  }

  return ctx;
}

export const getPrice = ({
  sale_price,
  qty,
  wholesale,
  wholesale_price,
  wholesale_qty,
}: Cart) => {
  if (wholesale) {
    if (qty >= parseInt(wholesale_qty, 10)) {
      return parseInt(wholesale_price, 10);
    }
  }

  return parseInt(sale_price, 10);
};

export const SALE_TYPES = ['cash', 'credit', 'layaway'];
export function useSaleTypesItems() {
  const { t } = useTranslation();
  const labels = useMemo(() => [t('Cash'), t('Credit'), t('Layaway')], [t]);
  const items: Record<string, string> = {};
  SALE_TYPES.forEach((slug, i) => {
    items[slug] = labels[i];
  });

  return items;
}

export function usePaymentMethodsItems() {
  const { t } = useTranslation();

  const payment_methods = _.get(
    usePage(),
    'props.payment_methods',
    [],
  ) as PaymentMethod[];
  const items: Record<string, string> = {};

  payment_methods.forEach(({ payment_slug, payment_label }) => {
    items[payment_slug] = t(payment_label);
  });

  return items;
}

export type CartContextType = RefObject<HTMLFormElement> | null;
