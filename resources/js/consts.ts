export const sell_types = ['cash', 'credit', 'layaway'] as const;
export const notification_intervals = [
  'daily',
  'weekly',
  'fortnightly',
  'monthly',
  'bimonthly',
  'quarterly',
  'biannual',
  'yearly',
] as const;
export const sell_statuses = ['pending', 'canceled', 'completed'] as const;
export const measurements = ['unit', 'liter', 'weight'] as const;
export const capabilities = [
  'see_sales', //
  'make_sales', //
  'manage_sales_payments', //
  'reprint_sales_invoices', //
  'void_sales', //
  'see_inventory', //
  'add_product', //
  'update_product', //
  'delete_product', //
  'see_stock', //
  'manage_stock', //
  'see_stock_orders', //
  'make_stock_orders_payments', //
  'see_categories',
  'add_category', //
  'update_category', //
  'delete_category', //
  'see_brands', //
  'add_brand', //
  'update_brand', //
  'delete_brand', //
  'see_clients', //
  'add_client', //
  'update_client', //
  'delete_client', //
  'see_payment_methods', //
  'add_payment_method', //
  'update_payment_method', //
  'delete_payment_method', //
];
