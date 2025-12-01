import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Typography,
  Button,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { StockLog } from './hooks';
import { getMeasurementSuffix } from '../hooks';

export default function LogDetails({ ...log }: LogDetailsProps) {
  const { t } = useTranslation();

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>{t('Name')}</TableCell>
          <TableCell>{t('Category')}</TableCell>
          <TableCell>{t('Brand')}</TableCell>
          <TableCell>{t('Adjustment')}</TableCell>
          <TableCell>{t('Had')}</TableCell>
          <TableCell>
            {t(log.adjustment_type === 'addition' ? 'Has' : 'Remaining')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {log.products.map((product) => (
          <TableRow key={`table-row-log-details-product-${product.id}`}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category.category_label}</TableCell>
            <TableCell>{product.brand.brand_label}</TableCell>
            <TableCell>
              {`${product.pivot.adjustment} ${getMeasurementSuffix(product.measurement, product.pivot.adjustment)}`}
            </TableCell>
            <TableCell>
              {`${product.pivot.from_stock} ${getMeasurementSuffix(product.measurement, product.pivot.from_stock)}`}
            </TableCell>
            <TableCell>
              {`${product.pivot.to_stock} ${getMeasurementSuffix(product.measurement, product.pivot.to_stock)}`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7} sx={{ borderWidth: 0 }}>
            <Footer>
              <Typography variant="body2" fontWeight="bold" sx={{ flex: 1 }}>
                {log.note && (
                  <>
                    {t('Note')}:&nbsp;{log.note}
                  </>
                )}
              </Typography>
              {log.sale_items.length > 0 && (
                <Button
                  variant="text"
                  startIcon={<ReceiptIcon />}
                  color="warning"
                  size="small"
                  onClick={() =>
                    router.visit(
                      route('sales', {
                        sale_id: log.sale_items[0].sale_id,
                      }),
                    )
                  }
                >
                  {t('View sale')}
                </Button>
              )}
              {log.payable_account && (
                <Button
                  variant="text"
                  startIcon={<ReceiptIcon />}
                  color="warning"
                  size="small"
                  onClick={() =>
                    router.visit(
                      route('inventory.stock.payable_accounts', {
                        id: log.payable_account.id,
                      }),
                    )
                  }
                >
                  {t('Payable account')}
                </Button>
              )}
            </Footer>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export interface LogDetailsProps extends StockLog {}

const Footer = styled.div(({ theme }) => ({
  paddingTop: theme.spacing(2),
  display: 'flex',
}));
