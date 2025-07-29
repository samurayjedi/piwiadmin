import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-final-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import PayFields from './PayFields';

export default function PayDialog({
  sale,
  onClose = () => {},
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const open = Boolean(sale);
  const firstInputRef = useRef<HTMLSelectElement>(null);
  const total = (sale?.total_amount ?? 0) - (sale?.amount_paid ?? 0);

  useEffect(() => {
    if (firstInputRef.current) {
      if (open) {
        firstInputRef.current.focus();
      }
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      keepMounted
    >
      <DialogTitle>
        <LabelDolarBs value={total} />
      </DialogTitle>
      <DialogContent>
        <Form
          subscription={{ submitting: true, pristine: true }}
          onSubmit={() => console.log('i love shu!!!!')}
          render={({ /** pristine, */ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <PayFields firstFieldRef={firstInputRef} total={total} />
              <Button
                sx={{ mt: 2 }}
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<ReceiptIcon />}
                disabled={submitting}
              >
                {t('Pay')}
              </Button>
            </form>
          )}
        />
      </DialogContent>
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
  };
  onClose?: () => void;
}
