import { router } from '@inertiajs/react';
import AppLayout from '@/src/Layouts/AppLayout';
import CrudTable from '@/src/Components/CrudTable';
import { usePaginatorProps } from '@/hooks';
import { useCategories, useFields } from './hooks';

export default function Categories() {
  const { page, count, rows } = usePaginatorProps();
  const categories = useCategories();
  const fields = useFields();

  return (
    <AppLayout>
      <CrudTable
        fields={fields}
        records={categories}
        onSubmit={(data, action, targetId) => {
          const url = (() => {
            switch (action) {
              case 'add':
                return route('categories.store');
              case 'update':
                return route('categories.update', { id: targetId });
              case 'delete':
                return route('categories.delete', { id: targetId });
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
            route('categories', {
              page,
              rows: parseInt(ev.target.value, 10),
            }),
          )
        }
        onPageChange={(ev, newPage) =>
          router.get(route('categories', { page: newPage, rows }))
        }
      />
    </AppLayout>
  );
}
