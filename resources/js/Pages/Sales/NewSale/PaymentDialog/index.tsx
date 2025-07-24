import { useMemo, useState } from 'react';
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

export default function PaymentDialog({
  open,
  amount,
  onClose = () => {},
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dolar = useAppSelector((state) => state.currencies.dolar);
  const [{ activeStep, clientFound }, setState] = useState({
    activeStep: 0,
    clientFound: -1,
  });
  const ctxValue = useMemo(
    () =>
      ({
        open,
        activeStep,
        clientFound,
        amount,
        setState,
      }) as CtxState,
    [open, activeStep, clientFound, amount],
  );

  return (
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
        <LinearProgress variant="determinate" value={(activeStep * 100) / 2} />
      </DialogActions>
    </Dialog>
  );
}

export interface ConfirmDialogProps {
  open: boolean;
  amount: number;
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
