import { useTranslation } from 'react-i18next';
import { Field, useField, FormSpy } from 'react-final-form';
import DatePicker from '@/src/lib/piwi/core/DatePicker';
import { useErrors } from '@/hooks';

export default function DueDateField() {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const {
    input: { value: payment_type },
  } = useField('payment_type', { subscription: { value: true } });

  if (payment_type === 'credit') {
    return (
      <FormSpy
        subscription={{ submitting: true }}
        render={({ submitting }) => (
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
        )}
      />
    );
  }

  return null;
}
