import styled from '@emotion/styled';
import _ from 'lodash';
import { Field, useField, FormSpy } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { useErrors } from '@/hooks';
import Select from '@/src/lib/piwi/core/Select';
import Gap from '@/src/lib/piwi/common/Gap';

const predefinedReasons = {
  addition: ['Return from Customer', 'Inventory Correction', 'Other'],
  subtraction: [
    'Product Expired',
    'Damaged Goods',
    'Theft/Loss',
    'Donation',
    'Sample/Demo',
    'Inventory Correction',
    'Other',
  ],
};

export default function ReasonField() {
  const { t } = useTranslation();
  const {
    input: { value: adjustment_type },
  } = useField('adjustment_type', { subscription: { value: true } });
  const [fuckErrors, onChangeDecorator] = useErrors();

  return (
    <FormSpy
      subscription={{ submitting: true }}
      render={({ submitting }) => (
        <Field
          name="reason"
          subscription={{ value: true }}
          render={({ input }) => {
            const reasons = _.get(
              predefinedReasons,
              adjustment_type,
              [],
            ) as string[];
            const translatedReasons: Record<string, string> = {};
            reasons.forEach((r) => {
              translatedReasons[r] = t(r);
            });

            return (
              <Container>
                <Select
                  {...input}
                  label={t('Reason')}
                  items={translatedReasons}
                  fullWidth
                  variant="standard"
                  color="secondary"
                  disabled={submitting}
                  onChange={onChangeDecorator(input.onChange)}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                />
                {input.value === reasons[reasons.length - 1] && (
                  <>
                    <Gap />
                    <Field
                      name="other_reason"
                      subscription={{ value: true }}
                      render={(pollito) => (
                        <TextField
                          {...pollito.input}
                          variant="standard"
                          label={t('Custom reason')}
                          fullWidth
                          color="secondary"
                          disabled={submitting}
                          onChange={onChangeDecorator(pollito.input.onChange)}
                          error={Boolean(fuckErrors[pollito.input.name])}
                          helperText={fuckErrors[pollito.input.name]}
                        />
                      )}
                    />
                  </>
                )}
              </Container>
            );
          }}
        />
      )}
    />
  );
}

const Container = styled.div({
  display: 'flex',
  flex: 1,
});
