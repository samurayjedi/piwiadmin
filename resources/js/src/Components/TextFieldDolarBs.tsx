/* eslint-disable no-unneeded-ternary */
import { useCallback, useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import TextFieldDualCurrency, {
  type TextFieldDualCurrencyProps,
} from '../lib/piwi/core/TextFieldDualCurrency';

export default function TextFieldDolarBs({
  value,
  onChange,
  helperText,
  ...props
}: TextFieldDolarBsProps) {
  const dolar = useAppSelector((state) => state.currencies.dolar);
  const sync = useAppSelector((state) => state.app.sync);
  const [mode, setMode] = useState<'$' | 'Bs.'>('$');
  const [val, setVal] = useState(parseFloat(value as string) || 0);
  useEffect(() => {
    setVal(parseFloat(value as string) || 0);
  }, [value]);

  const handleSwitch = useCallback((c: (string | undefined)[]) => {
    const [prefix, suffix] = c;
    if (prefix === '$') {
      setMode(prefix);
    } else if (suffix === 'Bs.') {
      setMode(suffix);
    }
  }, []);

  return (
    <TextFieldDualCurrency
      {...props}
      value={mode === '$' ? val : dolar * val}
      prefix="$"
      secSuffix="Bs."
      onSwitchCurrency={handleSwitch}
      onChange={(e) => {
        const input = parseFloat(e.target.value) || 0;
        let newInput = input;
        if (mode === 'Bs.') {
          newInput = input / dolar;
        }
        setVal(newInput);

        if (onChange) {
          onChange(newInput.toString());
        }
      }}
      helperText={(() => {
        if (sync !== 'ok') {
          return '-';
        }
        if (helperText) {
          return helperText;
        }

        return mode === 'Bs.'
          ? `${val.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}`
          : `${(dolar * val).toLocaleString('es-VE', {
              style: 'currency',
              currency: 'VES',
            })}`;
      })()}
    />
  );
}

export type TextFieldDolarBsProps = Omit<
  TextFieldDualCurrencyProps,
  'prefix' | 'suffix' | 'secPrefix' | 'secSuffix' | 'onChange'
> & {
  onChange?: (newValue: string) => void;
};
