import { useCallback } from 'react';
import _ from 'lodash';
import { SearchProps } from '@/src/lib/piwi/laboratory/Search';
import { useSearchFetch } from '@/src/lib/piwi/laboratory/Search/hooks';
import { type Product } from '@/Pages/Inventory/types';

export function useSearchClients(trigger: (p: any) => void) {
  const fetchSearch = useSearchFetch('search_client');

  const mockSubmit = useCallback(
    (s: string) => {
      return new Promise<string[]>((resolve, reject) => {
        fetchSearch('name', s)
          .then((r) => {
            if (r) {
              const ps = r.clients as Product[];
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
              trigger(r.clients);
            }

            resolve();
          })
          .catch((e) => reject(e));
      }),
    [fetchSearch, trigger],
  );

  return { mockSubmit, submit };
}
