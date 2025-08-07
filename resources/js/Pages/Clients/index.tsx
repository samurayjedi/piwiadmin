import { router } from '@inertiajs/react';
import AppLayout from '@/src/Layouts/AppLayout';
import CrudTable from '@/src/Components/CrudTable';
import { usePaginatorProps } from '@/hooks';
import { useClients } from './hooks';

export default function Clients() {
  const { page, count, rows } = usePaginatorProps();
  const clients = useClients();

  return (
    <AppLayout>
      <CrudTable
        fields={[
          [
            'identification',
            'Identification',
            {
              type: 'textfield-masked',
              props: {
                mask: '$##########',
                definitions: {
                  $: /[VEPJCGRvepjcgr]/,
                  '#': /[0-9]/,
                },
              },
            },
          ],
          ['name', 'Name'],
          [
            'phone',
            'Phone',
            {
              type: 'textfield-masked',
              props: {
                mask: '&$##-#######',
                definitions: {
                  '&': /[0]/,
                  $: /[24]/,
                  '#': /[0-9]/,
                },
              },
            },
          ],
          ['address', 'Address'],
        ]}
        records={clients}
        onSubmit={(data, action, targetId) => {
          const url = (() => {
            switch (action) {
              case 'add':
                return route('clients.store');
              case 'update':
                return route('clients.update', { id: targetId });
              case 'delete':
                return route('clients.delete', { id: targetId });
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
            route('clients', {
              page,
              rows: parseInt(ev.target.value, 10),
            }),
          )
        }
        onPageChange={(ev, newPage) =>
          router.get(route('clients', { page: newPage, rows }))
        }
      />
    </AppLayout>
  );
}
