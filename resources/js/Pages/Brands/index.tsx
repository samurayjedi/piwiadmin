import { router } from '@inertiajs/react';
import AppLayout from '@/src/Layouts/AppLayout';
import CrudTable from '@/src/Components/CrudTable';
import { usePaginatorProps } from '@/hooks';
import { useBrands, useFields } from './hooks';

export default function Brands() {
  const { page, count, rows } = usePaginatorProps();
  const brands = useBrands();
  const fields = useFields();

  return (
    <AppLayout>
      <CrudTable
        fields={fields}
        records={brands}
        onSubmit={(data, action, targetId) => {
          const url = (() => {
            switch (action) {
              case 'add':
                return route('brands.store');
              case 'update':
                return route('brands.update', { id: targetId });
              case 'delete':
                return route('brands.delete', { id: targetId });
            }

            return undefined;
          })();

          return new Promise<void>((resolve, reject) => {
            if (!url) {
              reject();

              return;
            }

            router.post(url, data, {
              preserveScroll: true,
              onError: () => {
                reject();
              },
              onSuccess: () => {
                resolve();
              },
            });
          });
        }}
        page={page}
        count={count}
        rows={rows}
        onRowsPerPageChange={(ev) =>
          router.get(
            route('brands', {
              page,
              rows: parseInt(ev.target.value, 10),
            }),
          )
        }
        onPageChange={(ev, newPage) =>
          router.get(route('brands', { page: newPage, rows }))
        }
      />
    </AppLayout>
  );
}
