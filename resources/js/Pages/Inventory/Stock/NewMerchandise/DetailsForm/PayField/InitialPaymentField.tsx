import { useTranslation } from 'react-i18next';
import { useField, Field, FormSpy } from 'react-final-form';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import { useErrors } from '@/hooks';

export default function InitialPaymentField() {
  const { t } = useTranslation();
  const {
    input: { value: payment_type },
  } = useField('payment_type', { subscription: { value: true } });
  const {
    input: { value: initial },
  } = useField('initial', { subscription: { value: true } });
  const [fuckErrors, onChangeDecorator] = useErrors();

  if (payment_type === 'credit' && initial) {
    return (
      <FormSpy
        subscription={{ submitting: true }}
        render={({ submitting }) => (
          <Field
            name="initial_payment"
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
        )}
      />
    );
  }

  return null;
}
