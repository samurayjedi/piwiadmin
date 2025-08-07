import { Field, useField, FormSpy } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { InputAdornment } from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';
import { useErrors } from '@/hooks';
import TextFieldNumericFormat from '@/src/lib/piwi/core/TextFieldNumericFormat';

export default function WholesaleProfitField() {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const {
    input: { value: wholesale },
  } = useField('wholesale', { subscription: { value: true } });

  return (
    wholesale && (
      <FormSpy
        subscription={{ submitting: true }}
        render={({ submitting }) => (
          <Field
            name="wholesale_profit"
            subscription={{ value: true }}
            render={(pollito) => (
              <TextFieldNumericFormat
                {...pollito.input}
                variant="standard"
                label={t('Wholesale Profit')}
                fullWidth
                color="secondary"
                disabled={submitting}
                onChange={onChangeDecorator(pollito.input.onChange)}
                error={Boolean(fuckErrors[pollito.input.name])}
                helperText={fuckErrors[pollito.input.name]}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PercentIcon />
                    </InputAdornment>
                  ),
                }}
                numericFormatProps={{
                  thousandSeparator: false,
                  suffix: '%',
                }}
              />
            )}
          />
        )}
      />
    )
  );
}
