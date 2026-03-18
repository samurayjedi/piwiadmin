import { RefObject, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  DialogContent,
  useMediaQuery,
  LinearProgress,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { useAppSelector } from '@/store/hooks';
import { CtxState, CTX_STEPPER } from './hooks';
import PaymentStepper from './PaymentStepper';
import { CartRef } from '../Cart';

export default function PaymentDialog({
  cartRef,
  onClose = () => {},
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const open = useAppSelector((state) => state.new_sale.payDialogOpen);
  const dolar = useAppSelector((state) => state.currencies.dolar);
  const [{ activeStep, clientFound }, setState] = useState({
    activeStep: 0,
    clientFound: -1,
  });
  const ctxValue = useMemo(
    () =>
      ({
        activeStep,
        clientFound,
        cartRef,
        setState,
      }) as CtxState,
    [activeStep, clientFound, cartRef],
  );
  const amount = cartRef.current?.total() ?? 0;

  return (
    open && (
      <Dialog
        open={open}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
        onClose={onClose}
        keepMounted
      >
        <DialogContent>
          <DialogHead>
            <DialogTitle>
              <Typography variant="h6">
                {t('Total to pay:')}
                &nbsp;
                {amount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </Typography>
              <Typography variant="subtitle1" color="gray">
                {(amount * dolar).toLocaleString('es-VE', {
                  style: 'currency',
                  currency: 'VES',
                })}
              </Typography>
            </DialogTitle>
            <Glue />
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </DialogHead>
          <Wrapper>
            <CTX_STEPPER.Provider value={ctxValue}>
              <PaymentStepper />
            </CTX_STEPPER.Provider>
          </Wrapper>
        </DialogContent>
        <DialogActions>
          <LinearProgress
            variant="determinate"
            value={(activeStep * 100) / 2}
          />
        </DialogActions>
      </Dialog>
    )
  );
}

export interface ConfirmDialogProps {
  cartRef: RefObject<CartRef>;
  onClose?: () => void;
}

const Wrapper = styled.div(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

const DialogHead = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
});

const DialogTitle = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Glue = styled.div({
  display: 'block',
  flex: 1,
});
