import { route as ziggyRoute } from 'ziggy-js';
import type { Theme as MUITheme } from '@mui/material/styles';
import {
  sell_notification_intervals,
  sell_types,
  sell_statuses,
  measurements,
} from './consts';

// merge @mui theme type with @emotion theme type
declare module '@emotion/react' {
  export interface Theme extends MUITheme {}
}

declare global {
  const route: typeof ziggyRoute; // use route whithout import
  interface FormData {
    entries(): IterableIterator<[string, FormDataEntryValue]>;
  }
  /** this app only */
  type Language = 'es-ES' | 'en-US';
  /** unique in sales (main) page */
  interface SalesPageProps extends Sale {
    client: Client;
    user: {
      id: number;
      name: string;
      email: string;
    };
    sale_items: {
      id: number;
      sale_id: number;
      product_id: number;
      quantity: number;
      unit_price: number;
      discount_id: number;
      created_at: string;
      updated_at: string;
      product: Product;
    }[];
    payments: (SalePayment & {
      payment_method: PaymentMethod;
    })[];
  }
  /** */
  interface AppPageProps {
    auth: {
      user: User;
    };
    props: {
      notifications: {
        id: string;
        data: Record<string, any>;
      }[];
      metrics?: {
        dayIncome: number;
        monthIncome: number;
        yearIncome: number;
        pendingIncome: number;
      };
      brands?: Brand[];
      categories?: Category[];
      products?: Product[];
      clients?: Client[];
      payment_methods?: PaymentMethod[];
      sales?: SalesPageProps[];
      page?: number;
      count?: number;
      rows?: number;
      sale_type?: string;
      date_init?: string;
      date_end?: string;
      /** Charts page props */
      sales_dataset?:
        | 'sales_by_type'
        | 'sales_by_category'
        | 'sales_by_brand'
        | 'sales_by_client'
        | 'sales_by_user';
      sales_timeframe?: 'sales_by_month' | 'sales_by_day';
      sales_date?: string;
      sales_layout?: 'vertical' | 'horizontal';
      sales_chart_type?: 'bar' | 'line' | 'scatter' | 'pie';
      dataset?: Record<string, string | number>[];
      dataset_labels?: Record<string, string>;
      bestSelling?: {
        id: number;
        name: string;
        measurement: (typeof measurements)[number];
        stock: number;
        total_units_sold: number;
        total_revenue: number;
        sold_percentage: number;
      }[];
    };
  }
  interface Category {
    id: number;
    category_label: string;
    category_slug: string;
    created_at: string;
    updated_at: string;
  }
  interface Brand {
    id: number;
    brand_label: string;
    brand_slug: string;
    created_at: string;
    updated_at: string;
  }
  interface Product {
    id: number;
    barcode: string;
    name: string;
    price: number;
    profit: number;
    measurement: (typeof measurements)[number];
    stock: number;
    category: Category;
    brand: Brand;
    wholesale: boolean;
    wholesale_qty: number;
    wholesale_profit: number;
  }
  interface Client {
    id: number;
    identification: string;
    name: string;
    phone: string;
    address: string;
    created_at: string;
    updated_at: string;
  }
  interface PaymentMethod {
    id: number;
    payment_label: string;
    payment_slug: string;
    payment_currency: string;
    created_at: string;
    updated_at: string;
  }
  type SellType = (typeof sell_types)[number];
  type NotificationInterval = (typeof sell_notification_intervals)[number];
  type SellStatus = (typeof sell_statuses)[number];
  interface Sale {
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
  interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
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
}
