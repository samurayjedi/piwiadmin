import { notification_intervals, sell_types, sell_statuses } from '@/consts';
import { type Client } from '../Clients/types';
import { type PaymentMethod } from '../PaymentMethods/types';
import { type Product } from '../Inventory/types';

export interface Cart extends Product {
  qty: number;
}

export type SellType = (typeof sell_types)[number];
export type NotificationInterval = (typeof notification_intervals)[number];
export type SellStatus = (typeof sell_statuses)[number];

export interface Sale {
  id: number;
  user_id: number;
  client_id: number;
  payment_type: SellType;
  total_amount: number;
  amount_paid: number;
  status: SellStatus;
  due_date: string;
  notification_interval: NotificationInterval;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  discount_id: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface SalesPageProps extends Sale {
  client: Client;
  user: {
    id: number;
    name: string;
    email: string;
  };
  sale_items: SaleItem[];
  payments: (SalePayment & {
    payment_method: PaymentMethod;
  })[];
}

interface SalePayment {
  id: number;
  sale_id: number;
  amount: number;
  payment_date: string;
  payment_method_id: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}
