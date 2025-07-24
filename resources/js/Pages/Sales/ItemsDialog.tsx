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
import { Cart } from './NewSale/SearchProductDialog';

export default function ItemsDialog({
  items,
  onClose = () => {},
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={Boolean(items)}
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
                <TableCell>{t('Tax')}</TableCell>
                <TableCell>{t('Sale price')}</TableCell>
                <TableCell>{t('Qty')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items?.map((item) => (
                <TableRow key={`items-dialog-item-${item.id}`}>
                  <TableCell>{item.barcode}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <LabelDolarBs value={parseFloat(item.tax)} />
                  </TableCell>
                  <TableCell>
                    <LabelDolarBs value={parseFloat(item.sale_price)} />
                  </TableCell>
                  <TableCell>x{item.qty}</TableCell>
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
  items?: Cart[];
  onClose?: () => void;
}
