import { useTranslation } from 'react-i18next';
import { useField, Field, FormSpy } from 'react-final-form';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import { useErrors } from '@/hooks';
import InitialPaymentField from './InitialPaymentField';

export default function PayField() {
  const { t } = useTranslation();
  const {
    input: { value: payment_type },
  } = useField('payment_type', { subscription: { value: true } });
  const [fuckErrors, onChangeDecorator] = useErrors();

  return (
    <FormSpy
      subscription={{ submitting: true }}
      render={({ submitting }) =>
        payment_type === 'credit' ? (
          <InitialPaymentField />
        ) : (
          <Field
            name="payment"
            subscription={{ value: true }}
            render={({ input }) => (
              <TextFieldDolarBs
                {...input}
                label={t('Payment')}
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
        )
      }
    />
  );
}
