import { useMemo } from 'react';
import { useAppPage } from '@/hooks';
import { CrudTableProps } from '@/src/Components/CrudTable/types';
import { type Category } from './types';

export function useCategories() {
  const { categories } = useAppPage().props;
  if (!categories) {
    throw new Error(
      'For some reason, categories prop is not available in this page.',
    );
  }

  return categories as Category[];
}
export function useFields(): CrudTableProps['fields'] {
  return useMemo(
    () => [
      ['category_label', 'Label'],
      [
        'category_slug',
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
