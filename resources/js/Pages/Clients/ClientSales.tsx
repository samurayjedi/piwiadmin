import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  Button,
  IconButton,
} from '@mui/material';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import ButtonStatus from '@/src/Components/ButtonStatus';
import TableRowCollapsible, {
  CollapseButton,
  defaultCollapseCallback,
} from '@/src/lib/piwi/animated/TableRowCollapsible';
import { ClientWithRelations } from './types';
import ProductInfoTable from './ProductInfoTable';

export default function ClientSales({ ...client }: ClientSalesProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>{t('ID')}</TableCell>
          <TableCell>{t('Type')}</TableCell>
          <TableCell>{t('Total')}</TableCell>
          <TableCell>{t('Paid')}</TableCell>
          <TableCell>{t('Date')}</TableCell>
          <TableCell>{t('Due date')}</TableCell>
          <TableCell>{t('Status')}</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {client.sales.map((sale, i) => (
          <TableRowCollapsible
            key={`client-sale-row-${sale.id}`}
            colSpan={7}
            collapsed={activeIndex === i}
            collapsedChildren={<ProductInfoTable {...sale} />}
          >
            <TableCell>
              <CollapseButton
                active={activeIndex === i}
                onClick={() => defaultCollapseCallback(i, setActiveIndex)}
              >
                {sale.id}
              </CollapseButton>
            </TableCell>
            <TableCell>{t(sale.payment_type)}</TableCell>
            <TableCell>
              <LabelDolarBs variant="horizontal" value={sale.total_amount} />
            </TableCell>
            <TableCell>
              <LabelDolarBs variant="horizontal" value={sale.amount_paid} />
            </TableCell>
            <TableCell>{sale.created_at}</TableCell>
            <TableCell>
              {sale.due_date ? sale.due_date : t('Not applicable')}
            </TableCell>
            <TableCell>
              <ButtonStatus status={sale.status} size="small" variant="text" />
            </TableCell>
            <TableCell>
              <IconButton
                title={t('Go to sale')}
                size="small"
                onClick={() =>
                  router.visit(route('sales', { sale_id: sale.id }))
                }
              >
                <ArrowForwardIcon />
              </IconButton>
            </TableCell>
          </TableRowCollapsible>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7} align="right">
            <Button
              size="small"
              variant="text"
              endIcon={<CallMissedOutgoingIcon />}
              onClick={() =>
                router.visit(route('sales.client', { client_id: client.id }))
              }
            >
              {t('View in sales')}
            </Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export interface ClientSalesProps extends ClientWithRelations {}
