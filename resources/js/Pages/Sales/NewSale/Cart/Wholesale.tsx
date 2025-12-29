import { useTranslation } from 'react-i18next';
import { useField, Field } from 'react-final-form';
import { Button } from '@mui/material';

export default function Wholesale({ name }: { name: string }) {
  return (
    <>
      <Field
        name={`${name}.wholesale`}
        subscription={{ value: true }}
        render={({ input }) => (
          <input type="hidden" name={input.name} value={input.value} />
        )}
      />
      <Field
        name={`${name}.wholesale_profit`}
        subscription={{ value: true }}
        render={({ input }) => (
          <input type="hidden" name={input.name} value={input.value} />
        )}
      />
      <Field
        name={`${name}.wholesale_qty`}
        subscription={{ value: true }}
        render={({ input }) => (
          <input type="hidden" name={input.name} value={input.value} />
        )}
      />
      <IsWholesale name={name} />
    </>
  );
}

function IsWholesale({ name }: { name: string }) {
  const { t } = useTranslation();
  const {
    input: { value: wholesale },
  } = useField(`${name}.wholesale`, { subscription: { value: true } });
  const {
    input: { value: wholesale_qty },
  } = useField(`${name}.wholesale_qty`, { subscription: { value: true } });
  const {
    input: { value: qty },
  } = useField(`${name}.qty`, { subscription: { value: true } });
  const isWholesale = wholesale && qty >= wholesale_qty;

  return (
    <Button variant="text" color={isWholesale ? 'success' : 'error'}>
      {isWholesale ? t('Yes') : t('No')}
    </Button>
  );
}
