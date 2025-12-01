import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { FormSpy, Field, useField } from 'react-final-form';
import {
  Checkbox,
  FormControlLabel as MUIFormControlLabel,
} from '@mui/material';

export default function InitialField() {
  const { t } = useTranslation();
  const {
    input: { value: payment_type },
  } = useField('payment_type', { subscription: { value: true } });

  if (payment_type === 'credit') {
    return (
      <FormSpy
        subscription={{ submitting: true }}
        render={({ submitting }) => (
          <Field
            name="initial"
            subscription={{ value: true }}
            render={({ input }) => (
              <FormControlLabel
                control={<Checkbox {...input} />}
                label={t('Initial?')}
                disabled={submitting}
              />
            )}
          />
        )}
      />
    );
  }

  return null;
}

const FormControlLabel = styled(MUIFormControlLabel)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  alignItems: 'flex-start',
  marginLeft: theme.spacing(1),
  '& span.MuiFormControlLabel-label': {
    marginLeft: 10,
    marginBottom: -4,
  },
}));
