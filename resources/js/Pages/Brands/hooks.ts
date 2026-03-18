import { useMemo } from 'react';
import { useAppPage } from '@/hooks';
import { CrudTableProps } from '@/src/Components/CrudTable/types';
import { type Brand } from './types';

export function useBrands() {
  const { brands } = useAppPage().props;
  if (!brands) {
    throw new Error(
      'For some reason, the brands props are no available in this page.',
    );
  }

  return brands as Brand[];
}

export function useFields(): CrudTableProps['fields'] {
  return useMemo(
    () => [
      ['brand_label', 'Label'],
      [
        'brand_slug',
        'Slug',
        {
          type: 'textfield',
          props: (mode) => ({
            disabled: mode === 'update',
          }),
        },
      ],
    ],
    [],
  );
}
