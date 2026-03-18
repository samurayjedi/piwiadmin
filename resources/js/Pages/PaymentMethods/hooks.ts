import { useMemo } from 'react';
import { useAppPage } from '@/hooks';
import { CrudTableProps } from '@/src/Components/CrudTable/types';
import { type PaymentMethod } from './types';

export function usePaymentMethods() {
  const { payment_methods } = useAppPage().props;
  if (!payment_methods) {
    throw new Error(
      'The payment methods prop for some reason are not available in this page.',
    );
  }

  return payment_methods as PaymentMethod[];
}

export function useFields(): CrudTableProps['fields'] {
  return useMemo(
    () => [
      ['payment_label', 'Label'],
      [
        'payment_slug',
        'Slug',
        {
          type: 'textfield',
          props: (mode) => ({
            disabled: mode === 'update',
          }),
        },
      ],
      [
        'payment_currency',
        'Currency',
        {
          type: 'select',
          props: {
            items: { Bs: 'Bs.', $: 'Dolar' },
          },
        },
      ],
    ],
    [],
  );
}
