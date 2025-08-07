import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FormSpy } from 'react-final-form';
import { Grid } from '@mui/material';
import { useErrors } from '@/hooks';
import Select from '@/src/lib/piwi/core/Select';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import { usePaymentMethodsItems } from '../hooks';
import Info from './Info';

export default function PayFields({
  firstFieldRef,
  total,
  mustReturnChange,
}: PayFieldsProps) {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const paymentMethods = usePaymentMethodsItems();

  return (
    <FormSpy
      subscription={{
        submitting: true,
      }}
      render={({ submitting }) => (
        <Grid container rowSpacing={1} sx={{ mt: '1px' }}>
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
                      inputRef={firstFieldRef}
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
                            label={paymentMethods[key]}
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
            <Info total={total} mustReturnChange={mustReturnChange} />
          </Grid>
        </Grid>
      )}
    />
  );
}

export interface PayFieldsProps {
  firstFieldRef?: RefObject<HTMLSelectElement>;
  total: number;
  mustReturnChange: boolean;
}
