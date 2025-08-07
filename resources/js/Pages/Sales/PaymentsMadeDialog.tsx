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
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useTheme } from '@mui/material/styles';
import { useAppSelector } from '@/store/hooks';

export default function PaymentsMadeDialog({
  sale,
  onClose = () => {},
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dolar = useAppSelector((state) => state.currencies.dolar);

  return (
    <Dialog
      open={Boolean(sale)}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      keepMounted
    >
      <DialogTitle>{t('Payments made')}</DialogTitle>
      <DialogContent>
        {sale?.payments.length ? (
          sale?.payments.map((p) => (
            <Typography variant="subtitle1">
              <strong>{p.payment_date}: &nbsp;</strong>
              {p.amount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
              &nbsp;
              {`(${(p.amount * dolar).toLocaleString('es-VE', {
                style: 'currency',
                currency: 'VES',
              })})`}
              &nbsp;{t('Via')}&nbsp;{p.payment_method.payment_label}
            </Typography>
          ))
        ) : (
          <Typography variant="subtitle1">
            {t('No payments have been made')}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="error" onClick={onClose}>
          {t('Close')}
        </Button>
        <Button
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
      </DialogActions>
    </Dialog>
  );
}

export interface ConfirmDialogProps {
  sale?: Sale & {
    client: Client;
    user: {
      id: number;
      name: string;
      email: string;
    };
    sale_items: {
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
    payments: (SalePayment & {
      payment_method: PaymentMethod;
    })[];
  };
  onClose?: () => void;
}
