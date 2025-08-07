import { router } from '@inertiajs/react';
import AppLayout from '@/src/Layouts/AppLayout';
import CrudTable from '@/src/Components/CrudTable';
import { usePaginatorProps } from '@/hooks';
import { usePaymentMethods } from './hooks';

export default function Categories() {
  const { page, count, rows } = usePaginatorProps();
  const paymentMethods = usePaymentMethods();

  return (
    <AppLayout>
      <CrudTable
        fields={[
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
    </AppLayout>
  );
}
