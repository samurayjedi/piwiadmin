import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import Skeleton from './Skeleton';

export default function LabelDolarBs({
  value,
  variant = 'vertical',
}: LabelDolarBsProps) {
  const dolar = useAppSelector((state) => state.currencies.dolar);

  if (variant === 'horizontal') {
    return (
      <Price>
        {value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
        &nbsp;(
        <Skeleton>
          <span>
            {(value * dolar).toLocaleString('es-VE', {
              style: 'currency',
              currency: 'VES',
            })}
          </span>
        </Skeleton>
        )
      </Price>
    );
  }

  return (
    <Container>
      <Amount color="CaptionText">
        {value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}
      </Amount>
      <Skeleton>
        <Amount variant="overline" color="GrayText">
          {(value * dolar).toLocaleString('es-VE', {
            style: 'currency',
            currency: 'VES',
          })}
        </Amount>
      </Skeleton>
    </Container>
  );
}

export interface LabelDolarBsProps {
  value: number;
  variant?: 'horizontal' | 'vertical';
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Amount = styled(Typography)({
  textWrap: 'nowrap',
});

const Price = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
});
