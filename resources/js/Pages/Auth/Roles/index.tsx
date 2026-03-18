import { router } from '@inertiajs/react';
import AppLayout from '@/src/Layouts/AppLayout';
import CrudTable from '@/src/Components/CrudTable';
import { usePaginatorProps } from '@/hooks';
import { useFields, useRoles } from './hooks';

export default function Roles() {
  const { page, count, rows } = usePaginatorProps();
  const roles = useRoles();
  const fields = useFields();

  return (
    <AppLayout>
      <CrudTable
        fields={fields}
        records={roles}
        onSubmit={(data, action, targetId) => {
          return new Promise<void>((resolve, reject) => {
            const params = {
              preserveScroll: true,
              onError: () => reject(),
              onSuccess: () => resolve(),
            };
            switch (action) {
              case 'add':
                router.post(route('add_role'), data, params);
                break;
              case 'update':
                router.put(
                  route('update_role', { id: targetId }),
                  data,
                  params,
                );
                break;
              case 'delete':
                router.delete(route('delete_role', { id: targetId }), params);
                break;
            }
          });
        }}
        page={page}
        count={count}
        rows={rows}
        onRowsPerPageChange={(ev) =>
          router.get(
            route('roles', {
              page,
              rows: parseInt(ev.target.value, 10),
            }),
          )
        }
        onPageChange={(ev, newPage) =>
          router.get(route('roles', { page: newPage, rows }))
        }
      />
    </AppLayout>
  );
}
