import { router } from '@inertiajs/react';
import { FormSpy } from 'react-final-form';
import { TablePagination } from '@mui/material';
import { usePaginatorProps } from '@/hooks';
import { useFilters } from './hooks';

export default function Paginator({ colSpan }: { colSpan: number }) {
  const { page, count, rows } = usePaginatorProps();
  const { in_debt, ids } = useFilters();

  return (
    <FormSpy
      subscription={{ submitting: true }}
      render={({ submitting }) => (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]} // , { label: t('All'), value: -1 }
          colSpan={colSpan}
          page={page}
          count={count}
          rowsPerPage={rows}
          disabled={submitting}
          onRowsPerPageChange={(ev) =>
            router.get(
              route('clients', {
                page,
                rows: parseInt(ev.target.value, 10),
                in_debt,
                ids,
              }),
            )
          }
          onPageChange={(ev, newPage) =>
            router.get(route('clients', { page: newPage, rows, in_debt, ids }))
          }
        />
      )}
    />
  );
}
