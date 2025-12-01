import { useAppPage } from '@/hooks';
import { notification_intervals } from '@/consts';
import { StockLog } from '../hooks';
import { Product } from '../../types';

export default function usePayableAccounts() {
  const { props } = useAppPage();
  if (!Object.hasOwnProperty.call(props, 'inventory_payable_accounts')) {
    throw new Error('Payable accounts no available in this context!!.');
  }

  return props.inventory_payable_accounts as PayableAccount[];
}

export interface PayableAccount {
  id: number;
  description: string;
  type: 'cash' | 'credit';
  total_amount: number;
  amount_paid: number;
  due_date: string;
  notification_interval: (typeof notification_intervals)[number];
  status: 'pending' | 'completed' | 'canceled';
  stock_log_id: number;
  created_at: string;
  updated_at: string;
  stock_log: StockLog;
  payments: {
    id: number;
    payable_account_id: number;
    amount: number;
    notes: string;
    created_at: string;
    updated_at: string;
  }[];
  items: {
    id: number;
    payable_account_id: number;
    product_id: number;
    unit_price: number;
    product: Product;
  }[];
}
