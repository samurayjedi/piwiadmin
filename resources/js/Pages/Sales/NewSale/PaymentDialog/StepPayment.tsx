import { useCallback, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { FormSpy, Field, useField } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useErrors } from '@/hooks';
import { sell_types, sell_notification_intervals } from '@/consts';
import { arrayToRecord } from '@/src/lib/miscUtils';
import PayFields from '@/Pages/Sales/PayFields';
import Select from '@/src/lib/piwi/core/Select';
import DatePicker from '@/src/lib/piwi/core/DatePicker';
import { useStepperContext } from './hooks';

export default function StepPayment() {
  const { t } = useTranslation();
  const { open, activeStep, setState, amount } = useStepperContext();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const selectRef = useRef<HTMLSelectElement>(null);

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
      subscription={{ submitting: true }}
      render={({ submitting }) => (
        <Container>
          <Field
            name="payment_type"
            subscription={{ value: true }}
            render={({ input }) => (
              <>
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
                {(input.value === 'layaway' || input.value === 'credit') && (
                  <>
                    <Field
                      name="notification_interval"
                      subscription={{ value: true }}
                      render={(pollito) => (
                        <Select
                          {...pollito.input}
                          label={t('Send notification')}
                          items={arrayToRecord(
                            sell_notification_intervals,
                            (item) => t(item),
                          )}
                          variant="standard"
                          fullWidth
                          color="primary"
                          disabled={submitting}
                          onChange={onChangeDecorator(pollito.input.onChange)}
                          error={Boolean(fuckErrors[pollito.input.name])}
                          helperText={fuckErrors[pollito.input.name]}
                        />
                      )}
                    />
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
                  </>
                )}
              </>
            )}
          />
          <PaymentFields total={amount} />
          <Actions>
            <Glue />
            <Button
              variant="text"
              sx={{ mt: 2 }}
              onClick={back}
              disabled={submitting}
            >
              {t('Back')}
            </Button>
            <Button
              sx={{ mt: 2 }}
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<ReceiptIcon />}
              disabled={submitting}
            >
              {t('Sell')}
            </Button>
          </Actions>
        </Container>
      )}
    />
  );
}

function PaymentFields({ total }: { total: number }) {
  const {
    input: { value: payment_type },
  } = useField('payment_type', { subscription: { value: true } });

  return <PayFields mustReturnChange={payment_type === 'cash'} total={total} />;
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Actions = styled.div({
  display: 'flex',
  alignItems: 'flex-end',
});

const Glue = styled.div({
  display: 'block',
  flex: 1,
});
