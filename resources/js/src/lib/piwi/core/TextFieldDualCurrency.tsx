import { useCallback, useMemo, useState } from 'react';
import _ from 'lodash';
import { InputAdornment, IconButton, TextFieldProps } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TextFieldCurrency, { TextFieldCurrencyProps } from './TextFieldCurrency';

export default function TextFieldDualCurrency({
  prefix,
  suffix,
  secPrefix = '',
  secSuffix = 'Bs.',
  onSwitchCurrency,
  InputProps,
  ...props
}: TextFieldDualCurrencyProps) {
  const [currentPrefixes, setCurrentPrefixes] = useState([prefix, suffix]);
  const [cPrefix, cSuffix] = currentPrefixes;

  const handleSwitchCurrency = useCallback(() => {
    let c: (string | undefined)[] = [];
    setCurrentPrefixes((prev) => {
      const primary = [prefix, suffix];
      const secondary = [secPrefix, secSuffix];
      if (_.isEqual(prev, primary)) {
        c = secondary;
        return secondary;
      }

      c = primary;
      return primary;
    });

    if (onSwitchCurrency) {
      onSwitchCurrency(c);
    }
  }, [onSwitchCurrency, prefix, secPrefix, secSuffix, suffix]);

  const myInputProps: TextFieldProps['InputProps'] = useMemo(
    () => ({
      ...InputProps,
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={handleSwitchCurrency}>
            <AutorenewIcon />
          </IconButton>
        </InputAdornment>
      ),
    }),
    [InputProps, handleSwitchCurrency],
  );

  return (
    <TextFieldCurrency
      {...props}
      prefix={cPrefix}
      suffix={cSuffix}
      InputProps={myInputProps}
    />
  );
}

export type TextFieldDualCurrencyProps = TextFieldCurrencyProps & {
  secPrefix?: string;
  secSuffix?: string;
  onSwitchCurrency?: (c: (string | undefined)[]) => void;
  InputProps?: Omit<TextFieldProps['InputProps'], 'endAdornment'>;
};
