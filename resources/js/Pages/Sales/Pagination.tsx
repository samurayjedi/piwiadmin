import { router } from '@inertiajs/react';
import { TablePagination } from '@mui/material';
import { usePaginatorProps } from '@/hooks';
import { useSaleFilters } from './hooks';

export default function Pagination({ colSpan }: { colSpan: number }) {
  const { client_id, sale_type, date_init, date_end } = useSaleFilters();
  const paginator = usePaginatorProps();
  const url = (page: number, rows: number) => {
    const common = {
      page,
      rows,
      ...(date_init !== 'none' ? { date_init } : {}),
      ...(date_end !== 'none' ? { date_end } : {}),
    };

    if (client_id > 0) {
      if (sale_type !== 'all') {
        return route('sales.client.sale_type', {
          ...common,
          client_id,
          sale_type,
        });
      }

      return route('sales.client', { ...common, client_id });
    }

    if (sale_type !== 'all') {
      return route('sale_type', { ...common, sale_type });
    }

    return route('sales', { ...common });
  };

  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]} // , { label: t('All'), value: -1 }
      colSpan={colSpan}
      rowsPerPage={paginator.rows}
      page={paginator.page}
      count={paginator.count}
      onRowsPerPageChange={(ev) =>
        router.get(route(url(paginator.page, parseInt(ev.target.value, 10))))
      }
      onPageChange={(ev, newPage) => router.get(url(newPage, paginator.rows))}
    />
  );
}
