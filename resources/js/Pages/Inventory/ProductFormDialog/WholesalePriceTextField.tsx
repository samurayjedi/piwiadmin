import { useTranslation } from 'react-i18next';
import { useField } from 'react-final-form';
import { InputAdornment } from '@mui/material';
import StyleIcon from '@mui/icons-material/Style';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';

export default function WholesalePriceTextfield() {
  const { t } = useTranslation();
  const {
    input: { value: wholesale },
  } = useField('wholesale', { subscription: { value: true } });
  const {
    input: { value: sPrice },
  } = useField('price', { subscription: { value: true } });
  const {
    input: { value: sProfitPercent },
  } = useField('wholesale_profit', { subscription: { value: true } });
  const price = parseFloat(sPrice);
  const profitPercent = parseFloat(sProfitPercent);
  const profit = (price * profitPercent) / 100;
  const salePrice = price + profit;

  return (
    wholesale && (
      <TextFieldDolarBs
        value={salePrice}
        variant="standard"
        label={t('Wholesale price')}
        fullWidth
        color="secondary"
        disabled
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <StyleIcon />
            </InputAdornment>
          ),
        }}
      />
    )
  );
}
