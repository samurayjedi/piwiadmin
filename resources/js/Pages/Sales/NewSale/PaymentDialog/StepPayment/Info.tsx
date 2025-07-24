import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useFormState, useForm } from 'react-final-form';
import { Typography } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import { useStepperContext } from '../hooks';

export default function Info() {
  const { t } = useTranslation();
  const dolar = useAppSelector((state) => state.currencies.dolar);
  const { amount } = useStepperContext();
  const form = useForm();
  const { values } = useFormState({
    subscription: {
      values: true,
    },
  });
  const paymentType = values.payment_type;

  if (paymentType === 'cash') {
    if (values.payment_methods) {
      const selectedPayments = values.payment_methods as string[];
      let payed = 0;
      selectedPayments.forEach((method) => {
        payed += parseFloat(values[method]) ?? 0;
      });

      if (payed > amount) {
        const change = payed - amount;
        form.change(
          'notes',
          `${t('Change was given by the ammount')}: ${change.toLocaleString(
            'en-US',
            {
              style: 'currency',
              currency: 'USD',
            },
          )} (${(change * dolar).toLocaleString('es-VE', {
            style: 'currency',
            currency: 'VES',
          })})`,
        );

        return <ChangeInfo change={change} />;
      }
    }
  }

  return <div />;
}

function ChangeInfo({ change }: { change: number }) {
  const { t } = useTranslation();
  const dolar = useAppSelector((state) => state.currencies.dolar);

  return (
    <InfoContainer>
      <Typography variant="subtitle1">
        <strong>{t('Change')}:</strong>
        &nbsp;
        {change.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </Typography>
      <Typography variant="caption" color="gray">
        {(change * dolar).toLocaleString('es-VE', {
          style: 'currency',
          currency: 'VES',
        })}
      </Typography>
    </InfoContainer>
  );
}

const InfoContainer = styled.div({
  display: 'flex',
  flexFlow: 'column',
});
