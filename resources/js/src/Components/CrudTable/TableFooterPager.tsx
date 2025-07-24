import {
  TableRow,
  TableFooter,
  TablePagination,
  TablePaginationProps,
} from '@mui/material';

export default function TableFooterPager({
  page,
  count,
  rows,
  onPageChange,
  onRowsPerPageChange,
}: TableFooterPagerProps) {
  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]} // , { label: t('All'), value: -1 }
          colSpan={10}
          count={count}
          rowsPerPage={rows}
          page={page}
          onRowsPerPageChange={onRowsPerPageChange}
          onPageChange={onPageChange}
        />
      </TableRow>
    </TableFooter>
  );
}

export interface TableFooterPagerProps {
  page: number;
  count: number;
  rows: number;
  onPageChange: TablePaginationProps['onPageChange'];
  onRowsPerPageChange: TablePaginationProps['onRowsPerPageChange'];
}
