import { SELL_TYPE, SELL_STATUS, PAYMENT_INTERVAL } from './const';

export interface Sale {
  id: number;
  user_id: number;
  client_id: number;
  payment_type: SELL_TYPE;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  status: SELL_STATUS;
  due_date: string;
  quotas: number;
  payment_interval: PAYMENT_INTERVAL;
  notes: string;
  created_at: string;
  updated_at: string;
}
