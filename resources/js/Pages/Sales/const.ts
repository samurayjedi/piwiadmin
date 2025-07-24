export const sell_types = ['cash', 'credit', 'layaway'] as const;
export const payment_intervals = [
  'weekly',
  'fortnightly',
  'monthly',
  'bimonthly',
  'quarterly',
  'biannual',
  'yearly',
] as const;
export const status = ['pending', 'canceled', 'completed'] as const;

export type SELL_TYPE = (typeof sell_types)[number];
export type PAYMENT_INTERVAL = (typeof payment_intervals)[number];
export type SELL_STATUS = (typeof status)[number];
