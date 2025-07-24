import _ from 'lodash';
import { usePage, router } from '@inertiajs/react';
import { Container } from '@mui/material';
import AppLayout from '@/src/Layouts/AppLayout';
import CrudTable from '@/src/Components/CrudTable';

export default function Categories() {
  const { page, count, rows } = usePage().props;
  const paymentMethods = _.get(
    usePage(),
    'props.payment_methods',
    [],
  ) as PaymentMethod[];

  return (
    <AppLayout>
      <Container maxWidth="lg">
        <CrudTable
          fields={[
            ['payment_label', 'Label'],
            ['payment_slug', 'Slug'],
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
          ]}
          records={paymentMethods}
          onSubmit={(data, action, targetId) => {
            const url = (() => {
              switch (action) {
                case 'add':
                  return route('payment_methods.store');
                case 'update':
                  return route('payment_methods.update', { id: targetId });
                case 'delete':
                  return route('payment_methods.delete', { id: targetId });
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
              route('payment_methods', {
                page,
                rows: parseInt(ev.target.value, 10),
              }),
            )
          }
          onPageChange={(ev, newPage) =>
            router.get(route('payment_methods', { page: newPage, rows }))
          }
        />
      </Container>
    </AppLayout>
  );
}

export interface PaymentMethod {
  id: number;
  payment_label: string;
  payment_slug: string;
  payment_currency: string;
  created_at: string;
  updated_at: string;
}
