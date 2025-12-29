import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  Typography,
  Button,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import { getMeasurementSuffix } from '../Inventory/hooks';
import { ClientWithRelations } from './types';

export default function ProductInfoTable({
  ...sale
}: ClientWithRelations['sales'][number]) {
  const { t } = useTranslation();

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>{t('Product')}</TableCell>
          <TableCell>{t('Quantity')}</TableCell>
          <TableCell>{t('Unit price')}</TableCell>
          <TableCell>{t('Import')}</TableCell>
          <TableCell>{t('Category')}</TableCell>
          <TableCell>{t('Brand')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sale.sale_items.map((sale_item) => (
          <TableRow key={`row-sale-item-${sale_item.id}`}>
            <TableCell>{sale_item.product.name}</TableCell>
            <TableCell>
              {`${sale_item.quantity} ${getMeasurementSuffix(sale_item.product.measurement, sale_item.quantity)}`}
            </TableCell>
            <TableCell>
              <LabelDolarBs variant="horizontal" value={sale_item.unit_price} />
            </TableCell>
            <TableCell>
              <LabelDolarBs
                variant="horizontal"
                value={sale_item.unit_price * sale_item.quantity}
              />
            </TableCell>
            <TableCell>{sale_item.product.category.category_label}</TableCell>
            <TableCell>{sale_item.product.brand.brand_label}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>
            <Typography variant="body2" fontWeight="bold">
              {sale.notes !== 'null' && sale.notes}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Button
              endIcon={<ReceiptIcon />}
              size="small"
              onClick={() => router.visit(route('sales', { sale_id: sale.id }))}
            >
              {t('Go to sale')}
            </Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
