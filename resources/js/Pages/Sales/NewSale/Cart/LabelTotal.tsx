import { useField } from 'react-final-form';
import LabelDolarBs from '@/src/Components/LabelDolarBs';

export default function LabelTotal({ name }: { name: string }) {
  const {
    input: { value: sale_price },
  } = useField(`${name}.sale_price`, { subscription: { value: true } });
  const {
    input: { value: qty },
  } = useField(`${name}.qty`, { subscription: { value: true } });

  return <LabelDolarBs value={sale_price * qty} />;
}
