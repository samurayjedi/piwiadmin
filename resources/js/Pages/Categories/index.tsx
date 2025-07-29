import { router } from '@inertiajs/react';
import { Container } from '@mui/material';
import AppLayout from '@/src/Layouts/AppLayout';
import CrudTable from '@/src/Components/CrudTable';
import { usePaginatorProps } from '@/hooks';
import { useCategories } from './hooks';

export default function Categories() {
  const { page, count, rows } = usePaginatorProps();
  const categories = useCategories();

  return (
    <AppLayout>
      <Container maxWidth="lg">
        <CrudTable
          fields={[
            ['category_label', 'Label'],
            ['category_slug', 'Slug'],
          ]}
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
      </Container>
    </AppLayout>
  );
}
