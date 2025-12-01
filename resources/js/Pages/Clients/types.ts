import { Sale, SaleItem } from '../Sales/types';

export interface Client {
  id: number;
  identification: string;
  name: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface ClientWithRelations extends Client {
  sales: (Sale & {
    sale_items: SaleItem[];
  })[];
}
