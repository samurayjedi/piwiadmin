import _ from 'lodash';
import { usePage } from '@inertiajs/react';
import { Sale } from './types';
import { Client } from '../Clients';
import { Product } from '../Inventory/Products';

export function useSales() {
  const salesProps = _.get(usePage(), 'props.sales', []) as Record<
    string,
    any
  >[];
  const sales = [] as SalesProp[];
  for (let i = 0; i < salesProps.length; i++) {
    sales[i] = {
      id: parseInt(salesProps[i].id, 10),
      user_id: parseInt(salesProps[i].user_id, 10),
      user: {
        id: parseInt(salesProps[i].user.id, 10),
        name: salesProps[i].user.name,
        email: salesProps[i].user.email,
      },
      client_id: parseInt(salesProps[i].client_id, 10),
      client: {
        id: parseInt(salesProps[i].client.id, 10),
        identification: salesProps[i].client.identification,
        name: salesProps[i].client.name,
        phone: salesProps[i].client.phone,
        address: salesProps[i].client.address,
        created_at: salesProps[i].client.created_at,
        updated_at: salesProps[i].client.updated_at,
      },
      payment_type: salesProps[i].payment_type,
      tax_amount: parseFloat(salesProps[i].tax_amount),
      total_amount: parseFloat(salesProps[i].total_amount),
      amount_paid: parseFloat(salesProps[i].amount_paid),
      status: salesProps[i].status,
      due_date: salesProps[i].due_date,
      quotas: parseInt(salesProps[i].quotas, 10),
      payment_interval: salesProps[i].payment_interval,
      notes: salesProps[i].notes,
      created_at: salesProps[i].created_at,
      updated_at: salesProps[i].updated_at,
      sale_items: salesProps[i].sale_items.map((item: any) => ({
        id: parseInt(item.id, 10),
        sale_id: parseInt(item.sale_id, 10),
        product_id: parseInt(item.product_id, 10),
        quantity: parseInt(item.quantity, 10),
        unit_price: parseFloat(item.unit_price),
        discount_id: parseInt(item.discount_id, 10),
        product: {
          id: parseInt(item.product.id, 10),
          barcode: item.product.barcode,
          name: item.product.name,
          price: parseFloat(item.product.price),
          sale_price: parseFloat(item.product.sale_price),
          tax: parseFloat(item.product.tax),
          stock: parseInt(item.product.stock, 10),
          category: item.product.category,
          brand: item.product.brand,
          wholesale: Boolean(item.product.wholesale),
          wholesale_qty: parseInt(item.product.wholesale_qty, 10),
          wholesale_price: parseFloat(item.product.wholesale_price),
        },
        created_at: item.created_at,
        updated_at: item.updated_at,
      })),
    };
  }

  return sales;
}

interface SalesProp extends Sale {
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
}
