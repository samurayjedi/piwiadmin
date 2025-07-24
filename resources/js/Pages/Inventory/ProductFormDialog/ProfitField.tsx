import { useTranslation } from 'react-i18next';
import { InputAdornment } from '@mui/material';
import { useFormState } from 'react-final-form';
import PercentIcon from '@mui/icons-material/Percent';
import TextFieldCurrency from '@/src/lib/piwi/core/TextFieldCurrency';

export default function ProfitField() {
  const { t } = useTranslation();
  const { values } = useFormState({
    subscription: {
      values: true,
    },
  });
  const { price, sale_price } = values;
  const profitAmount = sale_price - price;
  const profitPercentage = (profitAmount / price) * 100;

  return (
    <TextFieldCurrency
      value={profitPercentage}
      variant="standard"
      thousandSeparator={false}
      prefix=""
      suffix="%"
      label={`${t('Profit')} %`}
      fullWidth
      color="secondary"
      disabled
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PercentIcon />
          </InputAdornment>
        ),
      }}
      helperText={
        !isNaN(profitAmount)
          ? profitAmount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })
          : undefined
      }
    />
  );
}
