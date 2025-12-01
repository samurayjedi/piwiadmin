import _ from 'lodash';
import { useAppPage } from '@/hooks';
import { type SalesPageProps } from '@/Pages/Sales/types';
import { type Product } from '../types';
import { type PayableAccount } from './PayableAccounts/hooks';

export function useLogs() {
  const { props } = useAppPage();
  const logs = _.get(props, 'logs', undefined) as StockLog[];
  if (logs !== undefined) {
    return logs;
  }

  throw new Error('Stock logs not available in this context');
}

export interface StockLog {
  id: number;
  description: string;
  product_id: number;
  products: (Product & {
    pivot: {
      adjustment: number;
      from_stock: number;
      to_stock: number;
    };
  })[];
  sale_items: SalesPageProps['sale_items'][number][];
  adjustment_type: 'addition' | 'subtraction';
  reason: string;
  note: string;
  created_at: string;
  payable_account: PayableAccount;
}
