import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { FormSpy, Field, useField } from 'react-final-form';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import { useErrors } from '@/hooks';
import { convertBracketToDot } from '@/src/lib/miscUtils';

export default function UnitPrice({ name }: { name: string }) {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const {
    input: { value: update_prices },
  } = useField('update_prices', { subscription: { value: true } });

  if (!update_prices) {
    return null;
  }

  return (
    <FormSpy
      subscription={{ submitting: true }}
      render={({ submitting }) => (
        <Field
          name={`${name}.unit_price`}
          subscription={{ value: true }}
          render={({ input }) => (
            <TextFieldDolarBs
              {...input}
              variant="standard"
              label={t('Unit price')}
              color="secondary"
              disabled={submitting}
              onChange={onChangeDecorator(input.onChange)}
              error={Boolean(
                _.get(fuckErrors, convertBracketToDot(input.name)),
              )}
              helperText={_.get(fuckErrors, convertBracketToDot(input.name))}
            />
          )}
        />
      )}
    />
  );
}
