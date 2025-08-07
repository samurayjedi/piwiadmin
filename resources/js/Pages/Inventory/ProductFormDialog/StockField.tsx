import { Field, useField, FormSpy } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import Spinner from '@/src/lib/piwi/core/Spinner';
import { useErrors } from '@/hooks';
import { measurementNumericFormatProps } from '../hooks';

export default function StockField() {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const {
    input: { value: measurement },
  } = useField('measurement', { subscription: { value: true } });

  return (
    <FormSpy
      subscription={{ submitting: true }}
      render={({ submitting }) => (
        <Field
          name="stock"
          subscription={{ value: true }}
          render={({ input }) => (
            <Spinner
              {...input}
              min={0}
              variant="standard"
              label={t('Stock')}
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
