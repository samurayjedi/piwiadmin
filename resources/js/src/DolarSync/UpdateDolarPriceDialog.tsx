import { useCallback } from 'react';
import styled from '@emotion/styled';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Field, FormProps } from 'react-final-form';
import {
  Dialog,
  DialogContent,
  useMediaQuery,
  Button,
  DialogProps,
  Alert,
  DialogTitle,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useErrors } from '@/hooks';
import { toogleDialog } from '@/store/currencies';
import TextFieldCurrency from '../lib/piwi/core/TextFieldCurrency';
import Select from '../lib/piwi/core/Select';

export default function UpdateDolarPriceDialog() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [fuckErrors, onChangeDecorator] = useErrors();
  const sync = useAppSelector((state) => state.app.sync);
  const open = useAppSelector((state) => state.currencies.dialogOpen);

  const onSubmit = useCallback<FormProps['onSubmit']>((data) => {
    return new Promise<void>((resolve) => {
      const url = route('update-dolar-price.manually');
      router.post(url, data, {
        onSuccess: () => location.reload(),
        onFinish: () => resolve(),
      });
    });
  }, []);

  const onClose = useCallback<NonNullable<DialogProps['onClose']>>((e, r) => {
    if (r === 'backdropClick' || r === 'escapeKeyDown') {
      return;
    }

    dispatch(toogleDialog());
  }, []);

  return (
    <Dialog open={open} fullScreen={isMobile} maxWidth="xs" onClose={onClose}>
      <DialogTitle>{t('Dolar price')}</DialogTitle>
      <DialogContent>
        <Form
          subscription={{ submitting: true, pristine: true }}
          onSubmit={onSubmit}
          render={({ /** pristine, */ handleSubmit, submitting }) => (
            <HTMLForm onSubmit={handleSubmit}>
              {sync === 'error' && (
                <Alert severity="error">
                  {t(
                    'Cannot connect with server to update the dolar price, set it manually or reload the page.',
                  )}
                </Alert>
              )}
              <Field
                name="dolar"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextFieldCurrency
                    {...input}
                    suffix=" Bs."
                    prefix=""
                    variant="standard"
                    label={t('Price')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                  />
                )}
              />
              <Box sx={{ p: '4px' }} />
              <Field
                name="interval"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Select
                    {...input}
                    label={t("Don't ask me again until")}
                    items={{
                      one_hour: t('1 hour'),
                      three_hours: t('x hours', { x: 3 }),
                      five_hours: t('x hours', { x: 5 }),
                      eight_hours: t('x hours', { x: 8 }),
                      twelve_hours: t('x hours', { x: 12 }),
                    }}
                    variant="standard"
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                  />
                )}
              />
              <Actions>
                {sync === 'error' ? (
                  <Button
                    disabled={submitting}
                    color="success"
                    onClick={() => location.reload()}
                  >
                    {t('Reload page')}
                  </Button>
                ) : (
                  <Button
                    disabled={submitting}
                    color="success"
                    onClick={() => dispatch(toogleDialog())}
                  >
                    {t('Close')}
                  </Button>
                )}

                <Button disabled={submitting} type="submit" color="error">
                  {t('Set manually')}
                </Button>
              </Actions>
            </HTMLForm>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

const HTMLForm = styled.form({
  display: 'flex',
  flexDirection: 'column',
});

const Actions = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  paddingTop: theme.spacing(2),
}));
