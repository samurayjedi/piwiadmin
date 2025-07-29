import { useTranslation } from 'react-i18next';
import { useField } from 'react-final-form';
import { InputAdornment } from '@mui/material';
import SellIcon from '@mui/icons-material/Sell';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';

export default function SalePriceTextfield() {
  const { t } = useTranslation();
  const {
    input: { value: sPrice },
  } = useField('price', { subscription: { value: true } });
  const {
    input: { value: sProfitPercent },
  } = useField('profit', { subscription: { value: true } });
  const price = parseFloat(sPrice);
  const profitPercent = parseFloat(sProfitPercent);
  const profit = (price * profitPercent) / 100;
  const salePrice = price + profit;

  return (
    <TextFieldDolarBs
      value={salePrice}
      variant="standard"
      label={t('Sale price')}
      fullWidth
      color="secondary"
      disabled
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SellIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
