import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  TableCell,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Button,
  Box,
} from '@mui/material';
import SoapIcon from '@mui/icons-material/Soap';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TabsPager from '@/src/lib/piwi/animated/TabsPager';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import { useAppSelector } from '@/store/hooks';
import { type SalesPageProps } from './types';
import { getMeasurementSuffix } from '../Inventory/hooks';

export default function TableCellsSaleDetails({
  onPay,
  ...sale
}: TableCellsSaleDetailsProps) {
  const { t } = useTranslation();
  const sync = useAppSelector((state) => state.app.sync);

  return (
    <Content>
      <TabsPager
        tabSize="small"
        tabs={{
          purchase: t('Purchase'),
          payments_made: t('Payments made'),
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('Barcode')}</TableCell>
              <TableCell>{t('Name')}</TableCell>
              <TableCell>{t('Brand')}</TableCell>
              <TableCell>{t('Category')}</TableCell>
              <TableCell>{t('Sale price')}</TableCell>
              <TableCell>{t('Qty')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sale.sale_items.map((item) => (
              <TableRow key={`purchased-item-row-${item.id}`}>
                <TableCell>{item.product.barcode}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.brand.brand_label}</TableCell>
                <TableCell>{item.product.category.category_label}</TableCell>
                <TableCell>
                  <LabelDolarBs value={item.unit_price} variant="horizontal" />
                </TableCell>
                <TableCell>{`${item.quantity} ${getMeasurementSuffix(item.product.measurement, item.quantity)}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{t('Date')}</TableCell>
              <TableCell>{t('Amount')}</TableCell>
              <TableCell>{t('Payment method')}</TableCell>
              <TableCell>{t('Note')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!sale.payments.length ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('No payments have been made')}
                </TableCell>
              </TableRow>
            ) : (
              sale.payments.map((p) => (
                <TableRow key={`payment-row-${p.id}`}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.payment_date}</TableCell>
                  <TableCell>
                    <LabelDolarBs value={p.amount} variant="horizontal" />
                  </TableCell>
                  <TableCell>{p.payment_method.payment_label}</TableCell>
                  <TableCell>{p.notes}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TabsPager>
      <Footer>
        {sale.notes !== 'null' ? (
          <Typography variant="caption" sx={{ flex: 1 }}>
            <strong>{t('Sale notes')}:</strong>&nbsp;
            {sale.notes}
          </Typography>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}
        {sale.payment_type !== 'cash' && sale.status === 'pending' && (
          <Button
            size="small"
            variant="text"
            color="warning"
            startIcon={<SoapIcon />}
            onClick={() => onPay(sale)}
            disabled={sync !== 'ok'}
          >
            {t('Payment')}
          </Button>
        )}
        <Button
          size="small"
          variant="text"
          color="primary"
          startIcon={<ReceiptLongIcon />}
          onClick={() =>
            window.open(
              route('sales.sale.print_invoice', { id: sale?.id ?? 0 }),
              '_blank',
              'noopener,noreferrer',
            )
          }
        >
          {t('Print Invoice')}
        </Button>
      </Footer>
    </Content>
  );
}

export interface TableCellsSaleDetailsProps extends SalesPageProps {
  onPay: (sale: SalesPageProps) => void;
}

const Content = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginTop: -8,
});

const Footer = styled.div(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(1),
  alignItems: 'center',
}));
