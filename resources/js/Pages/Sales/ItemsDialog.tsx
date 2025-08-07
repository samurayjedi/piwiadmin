import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useMediaQuery,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import { getMeasurementSuffix } from '../Inventory/hooks';

export default function ItemsDialog({
  sale_items,
  onClose = () => {},
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={Boolean(sale_items)}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      onClose={onClose}
      keepMounted
    >
      <DialogTitle>{t('Purchase')}</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
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
              {sale_items?.map((item) => (
                <TableRow key={`items-dialog-item-${item.id}`}>
                  <TableCell>{item.product.barcode}</TableCell>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.product.brand.brand_label}</TableCell>
                  <TableCell>{item.product.category.category_label}</TableCell>
                  <TableCell>
                    <LabelDolarBs value={item.unit_price} />
                  </TableCell>
                  <TableCell>{`${item.quantity} ${getMeasurementSuffix(item.product.measurement, item.quantity)}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="primary" onClick={onClose}>
          {t('Ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface ConfirmDialogProps {
  onClose?: () => void;
  sale_items?: {
    id: number;
    sale_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    discount_id: number;
    created_at: string;
    updated_at: string;
    product: Product;
  }[];
}
