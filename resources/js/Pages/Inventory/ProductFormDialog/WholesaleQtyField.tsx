import { Field, useField, FormSpy } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import Spinner from '@/src/lib/piwi/core/Spinner';
import { useErrors } from '@/hooks';
import { measurementNumericFormatProps } from '../hooks';

export default function WholesaleQtyField() {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const {
    input: { value: wholesale },
  } = useField('wholesale', { subscription: { value: true } });
  const {
    input: { value: measurement },
  } = useField('measurement', { subscription: { value: true } });

  return !wholesale ? null : (
    <FormSpy
      subscription={{ submitting: true }}
      render={({ submitting }) => (
        <Field
          name="wholesale_qty"
          subscription={{ value: true }}
          render={({ input }) => (
            <Spinner
              {...input}
              min={0}
              variant="standard"
              label={t('Wholesale count')}
              fullWidth
              color="secondary"
              disabled={submitting}
              onChange={onChangeDecorator(input.onChange)}
              error={Boolean(fuckErrors[input.name])}
              helperText={fuckErrors[input.name]}
              numericFormatProps={measurementNumericFormatProps(
                measurement,
                parseFloat(input.value),
              )}
            />
          )}
        />
      )}
    />
  );
}
