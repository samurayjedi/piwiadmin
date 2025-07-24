import { TablePaginationProps } from '@mui/material';

export type Mode = 'add' | 'update' | 'delete' | 'none';

export interface CrudTableProps {
  fields: [string, string, Field?][];
  records: Record<string, any>[];
  onSubmit: (
    data: Record<string, any>,
    action: Mode,
    targetId: number,
  ) => Promise<any>;
  page: number;
  count: number;
  rows: number;
  onRowsPerPageChange: TablePaginationProps['onRowsPerPageChange'];
  onPageChange: TablePaginationProps['onPageChange'];
}

interface Field {
  type: 'textfield' | 'textfield-masked' | 'select';
  props: Record<string, any>;
}
