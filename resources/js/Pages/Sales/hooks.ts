import { useAppPage } from '@/hooks';
import { usePaymentMethods } from '@/Pages/PaymentMethods/hooks';
import { type Cart, type SalesPageProps, SellType } from './types';

export function useSales() {
  const { sales } = useAppPage().props;
  if (!sales) {
    throw new Error('The sales props are not available in this page.');
  }

  return sales as SalesPageProps[];
}

export function getPrice(item: getPriceParam) {
  const salePrice = (item.price * item.profit) / 100;
  const wholesaleSalePrice = (item.price * item.wholesale_profit) / 100;
  const isWholesaleSale = item.wholesale && item.qty >= item.wholesale_qty;

  return isWholesaleSale
    ? item.price + wholesaleSalePrice
    : item.price + salePrice;
}

type getPriceParam = {
  price: Cart['price'];
  profit: Cart['profit'];
  wholesale_profit: Cart['wholesale_profit'];
  wholesale: Cart['wholesale'];
  qty: Cart['qty'];
  wholesale_qty: Cart['wholesale_qty'];
};

export function usePaymentMethodsItems() {
  const payment_methods = usePaymentMethods();
  const items: Record<string, string> = {};

  payment_methods.forEach(({ payment_slug, payment_label }) => {
    items[payment_slug] = payment_label;
  });

  return items;
}

export function useSaleFilters() {
  const {
    props: { sale_type, date_init, date_end, client_id, client_name },
  } = useAppPage();

  if (!sale_type || !date_init || !date_end || !client_id) {
    throw new Error('For some reason, filters parameters aren\t available.');
  }

  return { sale_type, date_init, date_end, client_id, client_name } as {
    sale_type: SellType | 'all';
    date_init: string;
    date_end: string;
    client_id: number;
    client_name: string | null;
  };
}
