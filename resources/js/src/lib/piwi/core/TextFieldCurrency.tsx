import React, { ElementType } from 'react';
import _ from 'lodash';
import { NumericFormat } from 'react-number-format';
import {
  TextField,
  TextFieldProps,
  InputBaseComponentProps,
} from '@mui/material';

export default function TextFieldCurrency({
  InputProps,
  prefix = '$',
  suffix,
  thousandSeparator = true,
  ...rest
}: TextFieldCurrencyProps) {
  const miuInputProps = _.defaultTo(InputProps, {});
  const inputProps = _.defaultTo(miuInputProps.inputProps, {});

  return (
    <TextField
      {...rest}
      InputProps={{
        ...miuInputProps,
        inputComponent: MyNumberFormat as unknown as ElementType<
          InputBaseComponentProps,
          keyof JSX.IntrinsicElements
        >,
        inputProps: {
          ...inputProps,
          prefix,
          suffix,
          thousandSeparator,
        },
      }}
    />
  );
}

const MyNumberFormat = React.forwardRef<HTMLInputElement, MyNumberFormatProps>(
  (props, ref) => {
    const { prefix, suffix, thousandSeparator, onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator={thousandSeparator}
        valueIsNumericString
        prefix={prefix}
        suffix={suffix}
      />
    );
  },
);

interface MyNumberFormatProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  prefix: string;
  suffix?: string;
  thousandSeparator: boolean;
}

export type TextFieldCurrencyProps = TextFieldProps & {
  prefix?: string;
  suffix?: string;
  thousandSeparator?: boolean;
};
