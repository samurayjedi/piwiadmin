import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TableRow, TableCell } from '@mui/material';
import TableRowCollapsible from '@/src/lib/piwi/animated/TableRowCollapsible';
import { useSales } from './hooks';
import TableCellsSaleDetails from './TableCellsSaleDetails';
import TableCellsSale from './TableCellsSale';

export default function SalesRows() {
  const { t } = useTranslation();
  const sales = useSales();
  const [activeIndex, setActiveIndex] = useState(-1);

  return sales.length > 0 ? (
    sales.map((sale, index) => (
      <TableRowCollapsible
        colSpan={8}
        collapsed={activeIndex === index}
        collapsedChildren={<TableCellsSaleDetails {...sale} />}
      >
        <TableCellsSale
          {...sale}
          active={activeIndex === index}
          onRequestCollapse={() =>
            setActiveIndex((prev) => {
              if (prev === index) {
                return -1;
              }

              return index;
            })
          }
        />
      </TableRowCollapsible>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={8} align="center">
        {t('No records found!')}
      </TableCell>
    </TableRow>
  );
}
