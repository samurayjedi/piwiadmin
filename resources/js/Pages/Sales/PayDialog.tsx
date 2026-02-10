import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import styled from '@emotion/styled';
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
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closePayDialog } from '@/store/sales';
import { setSync } from '@/store/app';
import PayFields from './PayFields';

export default function PayDialog() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const open = useAppSelector((state) => state.sales.pay_dialog_open);
  const sale_id = useAppSelector((state) => state.sales.sale?.id ?? 0);
  const total_amount = useAppSelector(
    (state) => state.sales.sale?.total_amount ?? 0,
  );
  const amount_paid = useAppSelector(
    (state) => state.sales.sale?.amount_paid ?? 0,
  );
  const firstInputRef = useRef<HTMLSelectElement>(null);
  const total = (total_amount ?? 0) - (amount_paid ?? 0);

  const onClose = () => dispatch(closePayDialog());

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
          onSubmit={(data, form) =>
            new Promise<void>((resolve) => {
              router.post(
                route('sales.pay'),
                { ...data, sale_id },
                {
                  onBefore: () => {
                    dispatch(setSync('loading'));
                  },
                  onFinish: () => {
                    dispatch(setSync('ok'));
                    form.reset();
                    onClose();
                    resolve();
                  },
                },
              );
            })
          }
          render={({ /** pristine, */ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <PayFields
                mustReturnChange
                firstFieldRef={firstInputRef}
                total={total}
              />
              <Actions>
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
              </Actions>
            </form>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

const Actions = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
});
