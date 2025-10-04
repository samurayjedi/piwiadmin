import { useTranslation } from 'react-i18next';
import { useField, Field, FormSpy } from 'react-final-form';
import { useErrors } from '@/hooks';
import DatePicker from '@/src/lib/piwi/core/DatePicker';
import { DateView } from '@mui/x-date-pickers';

export default function DateField() {
  const { t } = useTranslation();
  const {
    input: { value: sales_timeframe },
  } = useField('sales_timeframe', { subscription: { value: true } });
  const [fuckErrors, onChangeDecorator] = useErrors();
  const views: DateView[] = (() => {
    switch (sales_timeframe) {
      case 'sales_by_month':
        return ['year'];
      case 'sales_by_day':
        return ['month', 'year'];
    }

    throw new Error('Timeframe not supported!!');
  })();

  return (
    <FormSpy
      subscription={{ submitting: true }}
      render={({ submitting }) => (
        <Field
          name="sales_date"
          subscription={{ value: true }}
          render={({ input }) => (
            <DatePicker
              {...input}
              label={t('Date')}
              disableFuture
              size="small"
              color="primary"
              variant="standard"
              clearable
              fullWidth
              disabled={submitting}
              views={views}
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
