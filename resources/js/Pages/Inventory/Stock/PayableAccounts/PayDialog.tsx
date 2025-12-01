import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Field, Form } from 'react-final-form';
import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  InputAdornment,
  TextField,
  Alert,
  Button,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import { useTheme } from '@mui/material/styles';
import { useErrors } from '@/hooks';
import Gap from '@/src/lib/piwi/common/Gap';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import usePayableAccounts from './hooks';

export default function PayDialog({ id, onClose = () => {} }: PayDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const payableAccounts = usePayableAccounts();
  const [fuckErrors, onChangeDecorator] = useErrors();

  if (id < 0) {
    return null;
  }

  const payableAccount = (() => {
    for (let i = 0; i < payableAccounts.length; i++) {
      const p = payableAccounts[i];
      if (p.id === id) {
        return p;
      }
    }

    throw new Error(`Cannot find id ${id}.`);
  })();

  return (
    <Dialog
      open={id > 0}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
    >
      <DialogTitle>
        {t('Amount to pay')}:
        <LabelDolarBs
          variant="horizontal"
          value={payableAccount.total_amount - payableAccount.amount_paid}
        />
      </DialogTitle>
      <DialogContent>
        {Object.hasOwnProperty.call(fuckErrors, 'kernel_panic') && (
          <>
            <Alert severity="error">{fuckErrors.kernel_panic}</Alert>
            <Gap />
          </>
        )}
        <Form
          onSubmit={(data) =>
            new Promise<void>((resolve) =>
              router.post(
                route('inventory.stock.payable_accounts.pay', { id }),
                data,
                {
                  preserveState: true,
                  onFinish: () => resolve(),
                  onSuccess: () => onClose(),
                },
              ),
            )
          }
          subscription={{ submitting: true, pristine: true }}
          render={({ submitting, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={payableAccount.id} />
              <Field
                name="amount"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextFieldDolarBs
                    {...input}
                    variant="standard"
                    label={t('Amount to pay')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Field
                name="note"
                subscription={{ value: true }}
                render={(pollito) => (
                  <TextField
                    {...pollito.input}
                    variant="standard"
                    label={t('Note')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(pollito.input.onChange)}
                    error={Boolean(fuckErrors[pollito.input.name])}
                    helperText={fuckErrors[pollito.input.name]}
                  />
                )}
              />
              <Actions>
                <Button
                  variant="text"
                  color="warning"
                  onClick={onClose}
                  disabled={submitting}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  variant="text"
                  color="success"
                  type="submit"
                  disabled={submitting}
                >
                  {t('Ok')}
                </Button>
              </Actions>
            </form>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

export interface PayDialogProps {
  id: number;
  onClose: () => void;
}

const Actions = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: theme.spacing(2),
}));
