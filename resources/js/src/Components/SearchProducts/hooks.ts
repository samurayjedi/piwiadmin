import { useCallback, useState, useEffect } from 'react';
import _ from 'lodash';
import { SearchProps } from '@/src/lib/piwi/laboratory/Search';
import { useSearchFetch } from '@/src/lib/piwi/laboratory/Search/hooks';
import { SyncState } from '@/store/app';
import { type Product } from '@/Pages/Inventory/types';

export function useRequestFocus(sync: SyncState) {
  const [sref, retrieveRef] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (sync !== 'loading') {
      if (sref) {
        sref.focus();
      }
    }
  }, [sref, sync]);

  return [sref, retrieveRef] as const;
}

export function useSearchProducts(trigger: (p: Product[]) => void) {
  const fetchSearch = useSearchFetch('search_product');

  const mockSubmit = useCallback(
    (s: string) => {
      return new Promise<string[]>((resolve, reject) => {
        fetchSearch('name', s)
          .then((r) => {
            if (r) {
              const ps = r.products as Product[];
              const results = _.map(ps, (p) => p.name);

              resolve(results);
            } else {
              resolve([]);
            }
          })
          .catch((e) => reject(e));
      });
    },
    [fetchSearch],
  );

  const submit = useCallback<NonNullable<SearchProps['onSubmit']>>(
    (field, value) =>
      new Promise<void>((resolve, reject) => {
        fetchSearch(field, value)
          .then((r) => {
            if (r) {
              trigger(r.products);
            }

            resolve();
          })
          .catch((e) => reject(e));
      }),
    [fetchSearch, trigger],
  );

  return { mockSubmit, submit };
}
