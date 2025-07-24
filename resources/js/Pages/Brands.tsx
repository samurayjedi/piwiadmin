import _ from 'lodash';
import { usePage, router } from '@inertiajs/react';
import { Container } from '@mui/material';
import AppLayout from '@/src/Layouts/AppLayout';
import CrudTable from '@/src/Components/CrudTable';

export default function Brands() {
  const { page, count, rows } = usePage().props;
  const brands = _.get(usePage(), 'props.brands', []) as Brand[];

  return (
    <AppLayout>
      <Container maxWidth="lg">
        <CrudTable
          fields={[
            ['brand_label', 'Label'],
            ['brand_slug', 'Slug'],
          ]}
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
          page={page as number}
          count={count as number}
          rows={rows as number}
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
      </Container>
    </AppLayout>
  );
}

export interface Brand {
  id: number;
  brand_label: string;
  brand_slug: string;
  created_at: string;
  updated_at: string;
}
