import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { useAppSelector } from '@/store/hooks';

export default function LabelDolarBs({ value }: LabelDolarBsProps) {
  const dolar = useAppSelector((state) => state.currencies.dolar);

  return (
    <Container>
      <Amount color="CaptionText">
        {value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </Amount>
      <Amount variant="overline" color="GrayText">
        {(value * dolar).toLocaleString('es-VE', {
          style: 'currency',
          currency: 'VES',
        })}
      </Amount>
    </Container>
  );
}

export interface LabelDolarBsProps {
  value: number;
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Amount = styled(Typography)({
  textWrap: 'nowrap',
});
