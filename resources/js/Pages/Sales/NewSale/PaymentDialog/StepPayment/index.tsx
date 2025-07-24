import { useCallback, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Field, FormSpy } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { Grid, Button } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useErrors } from '@/hooks';
import Select from '@/src/lib/piwi/core/Select';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import DatePicker from '@/src/lib/piwi/core/DatePicker';
import Spinner from '@/src/lib/piwi/core/Spinner';
import { arrayToRecord } from '@/src/lib/miscUtils';
import { useStepperContext } from '../hooks';
import { usePaymentMethodsItems } from '../../hooks';
import { sell_types, payment_intervals } from '../../../const';
import Info from './Info';

export default function StepPayment() {
  const { t } = useTranslation();
  const paymentMethods = usePaymentMethodsItems();
  const { open, activeStep, setState } = useStepperContext();
  const selectRef = useRef<HTMLSelectElement>(null);

  const [fuckErrors, onChangeDecorator] = useErrors();
  const back = useCallback(() => {
    setState((prev) => ({ ...prev, activeStep: 1 }));
  }, [setState]);

  useEffect(() => {
    if (open && activeStep === 2) {
      if (selectRef.current) {
        selectRef.current.focus();
      }
    }
  }, [open, activeStep]);

  return (
    <FormSpy
      subscription={{
        submitting: true,
      }}
      render={({ submitting }) => (
        <Grid container rowSpacing={1} sx={{ mt: 1 }}>
          <Field
            name="payment_type"
            subscription={{ value: true }}
            render={({ input }) => (
              <>
                <Grid item xs={12}>
                  <Select
                    {...input}
                    inputRef={selectRef}
                    label={t('Payment type')}
                    items={arrayToRecord(sell_types, (item) => t(item))}
                    variant="standard"
                    fullWidth
                    color="primary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                  />
                </Grid>
                {(input.value === 'layaway' || input.value === 'credit') && (
                  <>
                    {input.value === 'credit' && (
                      <>
                        <Grid item xs={12} md={6}>
                          <Field
                            name="payment_interval"
                            subscription={{ value: true }}
                            render={(pollito) => (
                              <Select
                                {...pollito.input}
                                label={t('Payment interval')}
                                items={arrayToRecord(
                                  payment_intervals,
                                  (item) => t(item),
                                )}
                                variant="standard"
                                fullWidth
                                color="primary"
                                disabled={submitting}
                                onChange={onChangeDecorator(
                                  pollito.input.onChange,
                                )}
                                error={Boolean(fuckErrors[pollito.input.name])}
                                helperText={fuckErrors[pollito.input.name]}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <SpinnerContainer>
                            <Field
                              name="quotas"
                              subscription={{ value: true }}
                              render={(pollito) => (
                                <Spinner
                                  {...pollito.input}
                                  label={t('Quotas')}
                                  variant="standard"
                                  min={1}
                                  max={99}
                                  onChange={onChangeDecorator(
                                    pollito.input.onChange,
                                  )}
                                  error={Boolean(
                                    fuckErrors[pollito.input.name],
                                  )}
                                  helperText={fuckErrors[pollito.input.name]}
                                />
                              )}
                            />
                          </SpinnerContainer>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <Field
                        name="due_date"
                        subscription={{ value: true }}
                        render={(pollito) => (
                          <DatePicker
                            {...pollito.input}
                            label={t('Due date')}
                            disablePast
                            fullWidth
                            color="secondary"
                            variant="standard"
                            disabled={submitting}
                            onChange={onChangeDecorator(pollito.input.onChange)}
                            error={Boolean(fuckErrors[pollito.input.name])}
                            helperText={fuckErrors[pollito.input.name]}
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}
          />
          <Field
            name="payment_methods[]"
            subscription={{ value: true }}
            render={({ input }) => {
              const val = Array.isArray(input.value) ? input.value : [];

              return (
                <>
                  <Grid item xs={12}>
                    <Select
                      {...input}
                      value={val}
                      label={t('Payment Methods')}
                      items={paymentMethods}
                      variant="standard"
                      fullWidth
                      color="primary"
                      multiple
                      disabled={submitting}
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors.payment_methods)}
                      helperText={fuckErrors.payment_methods}
                    />
                  </Grid>
                  {val.map((key) => (
                    <Grid
                      key={`payment-method-textfield-${key}`}
                      item
                      xs={12}
                      md={6}
                    >
                      <Field
                        name={key}
                        subscription={{ value: true }}
                        render={(pollito) => (
                          <TextFieldDolarBs
                            {...pollito.input}
                            label={t(paymentMethods[key])}
                            variant="standard"
                            fullWidth
                            color="secondary"
                            disabled={submitting}
                            onChange={onChangeDecorator(pollito.input.onChange)}
                            error={Boolean(fuckErrors[pollito.input.name])}
                            helperText={fuckErrors[pollito.input.name]}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </>
              );
            }}
          />
          <Grid item xs={12} container>
            <Info />
            <Glue />
            <Button variant="text" sx={{ mt: 2 }} onClick={back}>
              {t('Back')}
            </Button>
            <Button
              sx={{ mt: 2 }}
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<ReceiptIcon />}
            >
              {t('Sell')}
            </Button>
          </Grid>
        </Grid>
      )}
    />
  );
}

const SpinnerContainer = styled.div({
  display: 'flex',
  alignItems: 'flex-end',
  height: '100%',
});

const Glue = styled.div({
  display: 'block',
  flex: 1,
});
