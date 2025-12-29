import { useState } from 'react';
import { Field, useField, useForm } from 'react-final-form';
import Spinner from '@/src/lib/piwi/core/Spinner';
import { measurementNumericFormatProps } from '@/Pages/Inventory/hooks';
import { getPrice } from '../../hooks';

export default function QtyField({ name }: { name: string }) {
  const [flag, setFlag] = useState(false);
  const form = useForm();
  const {
    input: { value: stock },
  } = useField(`${name}.stock`, { subscription: { value: true } });
  const {
    input: { value: measurement },
  } = useField(`${name}.measurement`, { subscription: { value: true } });
  // for get price
  const {
    input: { value: price },
  } = useField(`${name}.price`, { subscription: { value: true } });
  const {
    input: { value: profit },
  } = useField(`${name}.profit`, { subscription: { value: true } });
  const {
    input: { value: wholesale_profit },
  } = useField(`${name}.wholesale_profit`, { subscription: { value: true } });
  const {
    input: { value: wholesale },
  } = useField(`${name}.wholesale`, { subscription: { value: true } });
  const {
    input: { value: wholesale_qty },
  } = useField(`${name}.wholesale_qty`, { subscription: { value: true } });

  return (
    <Field
      name={`${name}.qty`}
      subscription={{ value: true }}
      render={({ input }) => (
        <Spinner
          {...input}
          onChange={(e) => {
            input.onChange(e);
            const isWholesale =
              wholesale && parseFloat(input.value) >= wholesale_qty;
            if (flag !== isWholesale) {
              const nPrice = getPrice({
                price,
                profit,
                wholesale_profit,
                wholesale,
                qty: parseFloat(input.value),
                wholesale_qty,
              });
              form.change(`${name}.sale_price`, parseFloat(nPrice.toFixed(2)));
            }
            setFlag(isWholesale);
          }}
          variant="standard"
          min={measurement === 'unit' ? 1 : 0.01}
          max={stock}
          numericFormatProps={measurementNumericFormatProps(
            measurement,
            input.value,
          )}
        />
      )}
    />
  );
}
