import { Field, FormSpy, useField } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { useErrors } from '@/hooks';

export default function PayNoteField() {
  const { t } = useTranslation();
  const {
    input: { value: payment_type },
  } = useField('payment_type', { subscription: { value: true } });
  const {
    input: { value: initial },
  } = useField('initial', { subscription: { value: true } });
  const [fuckErrors, onChangeDecorator] = useErrors();

  if (
    payment_type === 'cash' ||
    (payment_type === 'credit' && initial === true)
  ) {
    return (
      <FormSpy
        subscription={{ submitting: true }}
        render={({ submitting }) => (
          <Field
            name="pay_note"
            subscription={{ value: true }}
            render={({ input }) => (
              <TextField
                {...input}
                variant="standard"
                label={t('Payment note')}
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
}
