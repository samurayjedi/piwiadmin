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
import { useAppDispatch } from '@/store/hooks';
import { setSync } from '@/store/app';
import { type SalesPageProps } from './types';
import PayFields from './PayFields';

export default function PayDialog({
  sale,
  onClose = () => {},
}: ConfirmDialogProps) {
  const dispatch = useAppDispatch();
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
          onSubmit={(data, form) =>
            new Promise<void>((resolve) => {
              router.post(
                route('sales.pay'),
                { ...data, sale_id: sale?.id },
                {
                  onBefore: () => {
                    dispatch(setSync('loading'));
                  },
                  onFinish: () => {
                    dispatch(setSync('ok'));
                    form.reset();
                    resolve();
                  },
                  onSuccess: () => onClose(),
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

export interface ConfirmDialogProps {
  sale?: SalesPageProps;
  onClose?: () => void;
}
