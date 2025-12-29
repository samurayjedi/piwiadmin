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
  Typography,
  TableContainer,
} from '@mui/material';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
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
  const { total, pending, payed } = (() => {
    let tl = 0;
    let p = 0;
    let py = 0;
    client.sales.forEach((s) => {
      tl += s.total_amount;
      p += s.total_amount - s.amount_paid;
      py += s.amount_paid;
    });

    return { total: tl, pending: p, payed: py };
  })();

  return (
    <TableContainer
      sx={{
        maxHeight: 400, // This makes the entire table container scrollable
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('ID')}</TableCell>
            <TableCell>{t('Type')}</TableCell>
            <TableCell>{t('Status')}</TableCell>
            <TableCell>{t('Date')}</TableCell>
            <TableCell>{t('Due date')}</TableCell>
            <TableCell>{t('Total')}</TableCell>
            <TableCell />
            <TableCell>{t('Paid')}</TableCell>
            <TableCell />
            <TableCell>{t('Pending')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {client.sales.map((sale, i) => (
            <TableRowCollapsible
              key={`client-sale-row-${sale.id}`}
              colSpan={10}
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
                <ButtonStatus
                  status={sale.status}
                  size="small"
                  variant="text"
                />
              </TableCell>
              <TableCell>{sale.created_at}</TableCell>
              <TableCell>
                {sale.due_date ? sale.due_date : t('Not applicable')}
              </TableCell>
              <TableCell>
                <LabelDolarBs value={sale.total_amount} />
              </TableCell>
              <TableCell />
              <TableCell>
                <LabelDolarBs value={sale.amount_paid} />
              </TableCell>
              <TableCell />
              <TableCell>
                <LabelDolarBs value={sale.total_amount - sale.amount_paid} />
              </TableCell>
            </TableRowCollapsible>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} sx={{ borderWidth: '1px !important' }} />
            <TableCell sx={{ borderWidth: '1px !important' }}>
              <LabelDolarBs value={total} />
            </TableCell>
            <TableCell sx={{ borderWidth: '1px !important' }}>
              <Typography variant="subtitle2" fontWeight="bold">
                -
              </Typography>
            </TableCell>
            <TableCell sx={{ borderWidth: '1px !important' }}>
              <LabelDolarBs value={payed} />
            </TableCell>
            <TableCell sx={{ borderWidth: '1px !important' }}>
              <Typography variant="subtitle2" fontWeight="bold">
                =
              </Typography>
            </TableCell>
            <TableCell sx={{ borderWidth: '1px !important' }}>
              <LabelDolarBs value={pending} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="right" colSpan={10}>
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
    </TableContainer>
  );
}

export interface ClientSalesProps extends ClientWithRelations {}
