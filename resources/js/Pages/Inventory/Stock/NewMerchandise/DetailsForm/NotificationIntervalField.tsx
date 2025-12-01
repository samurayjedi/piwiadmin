import { useTranslation } from 'react-i18next';
import { Field, useField, FormSpy } from 'react-final-form';
import Select from '@/src/lib/piwi/core/Select';
import { useErrors } from '@/hooks';

export default function NotificationIntervalField() {
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
            name="notification_interval"
            subscription={{ value: true }}
            render={({ input }) => (
              <Select
                {...input}
                label={t('Notification interval')}
                items={{
                  daily: t('daily'),
                  weekly: t('weekly'),
                  fortnightly: t('fortnightly'),
                  monthly: t('monthly'),
                  bimonthly: t('bimonthly'),
                  quarterly: t('quarterly'),
                  biannual: t('biannual'),
                  yearly: t('yearly'),
                }}
                fullWidth
                variant="standard"
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
