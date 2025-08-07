import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useMediaQuery,
  Button,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppSelector } from '@/store/hooks';
import { getPrice } from '../Sales/hooks';
import { getMeasurementSuffix } from './hooks';

export default function WholesaleInfoDialog({
  product,
  onClose = () => {},
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dolar = useAppSelector((state) => state.currencies.dolar);
  const wholesalePrice = product
    ? getPrice({ ...product, qty: Number.MAX_SAFE_INTEGER })
    : 0;

  return (
    <Dialog
      open={Boolean(product)}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      keepMounted
    >
      <DialogTitle>
        {t('Wholesale details of')}: {product?.name}
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">
          <strong>{t('Profit')}: &nbsp;</strong>
          {product?.wholesale_profit}%
        </Typography>
        <Typography variant="subtitle1">
          <strong>{t('Sale Price')}: &nbsp;</strong>
          {wholesalePrice.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
          &nbsp;
          {`(${(wholesalePrice * dolar).toLocaleString('es-VE', {
            style: 'currency',
            currency: 'VES',
          })})`}
        </Typography>
        <Typography variant="subtitle1">
          <strong>{t('Apply from')}: &nbsp;</strong>x{product?.wholesale_qty}
          &nbsp;
          {getMeasurementSuffix(
            product?.measurement ?? '',
            product?.stock ?? 0,
          )}
        </Typography>
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
  product?: Product & {
    category: Category;
    brand: Brand;
  };
  onClose?: () => void;
}
