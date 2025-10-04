import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import Skeleton from '@/src/Components/Skeleton';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toogleDialog } from '@/store/currencies';

export default function DolarPrice() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const dolar = useAppSelector((state) => state.currencies.dolar);

  return (
    <Skeleton variant="rounded" sx={{ mr: 1 }}>
      <Amount
        title={t('Click for set manually')}
        onClick={() => dispatch(toogleDialog())}
      >
        1$/
        {dolar.toLocaleString('es-VE', {
          style: 'currency',
          currency: 'VES',
        })}
      </Amount>
    </Skeleton>
  );
}

const Amount = styled(Button)({
  textWrap: 'nowrap',
});
