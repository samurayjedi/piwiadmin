import { FormSpy, Field, useField } from 'react-final-form';
import Spinner from '@/src/lib/piwi/core/Spinner';
import { useTranslation } from 'react-i18next';
import { useErrors } from '@/hooks';
import Gap from '@/src/lib/piwi/common/Gap';
import { measurementNumericFormatProps } from '../hooks';

export default function NotificationStockField() {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const {
    input: { value: notification },
  } = useField('notification', { subscription: { value: true } });
  const {
    input: { value: measurement },
  } = useField('measurement', { subscription: { value: true } });

  if (!notification) {
    return null;
  }

  return (
    <>
      <FormSpy
        subscription={{ submitting: true }}
        render={({ submitting }) => (
          <Field
            name="notification_stock"
            subscription={{ value: true }}
            render={({ input }) => (
              <Spinner
                {...input}
                sx={{ width: 100 }}
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
      <Gap spacing={2} />
    </>
  );
}
