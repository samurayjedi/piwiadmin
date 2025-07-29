import { useTranslation } from 'react-i18next';
import { useAppPage } from '@/hooks';
import { usePaymentMethods } from '@/Pages/PaymentMethods/hooks';
import { Cart } from './types';

export function useSales() {
  const { sales } = useAppPage().props;
  if (!sales) {
    throw new Error('The sales props are not available in this page.');
  }

  return sales;
}

export function getPrice(item: Cart) {
  const salePrice = (item.price * item.profit) / 100;
  const wholesaleSalePrice = (item.price * item.wholesale_profit) / 100;
  const isWholesaleSale = item.wholesale && item.qty >= item.wholesale_qty;

  return isWholesaleSale
    ? item.price + wholesaleSalePrice
    : item.price + salePrice;
}

export function usePaymentMethodsItems() {
  const { t } = useTranslation();
  const payment_methods = usePaymentMethods();
  const items: Record<string, string> = {};

  payment_methods.forEach(({ payment_slug, payment_label }) => {
    items[payment_slug] = t(payment_label);
  });

  return items;
}
