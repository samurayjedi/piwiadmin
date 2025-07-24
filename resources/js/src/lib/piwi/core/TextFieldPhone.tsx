import React, { ElementType } from 'react';
import _ from 'lodash';
import { IMaskInput } from 'react-imask';
import {
  TextField,
  TextFieldProps,
  InputBaseComponentProps,
} from '@mui/material';
import sourceDialCodes from './SelectCountry/countries_dialcodes.json';

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (props, ref) => {
    const countriesDialCodes = sourceDialCodes as Record<string, string>;
    const { code, onChange, ...other } = props;
    const dialCode = countriesDialCodes[code];
    const escapedCode = dialCode.replace(/0/g, '\\0');
    const supervaca = escapedCode.replace(/and/g, '&');

    return (
      <IMaskInput
        {...other}
        mask={`(+${supervaca}) ###-#######`}
        definitions={{
          '#': /[0-9]/,
        }}
        inputRef={ref}
        onAccept={(value) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

export default function TextFieldPhone({
  InputProps,
  ...rest
}: TextFieldProps) {
  const code = _.get(InputProps, 'inputProps.code', undefined) as
    | string
    | undefined;

  if (!code) {
    return <TextField {...rest} disabled />;
  }

  return (
    <TextField
      {...rest}
      InputProps={{
        ...InputProps,
        inputComponent: PhoneInput as unknown as ElementType<
          InputBaseComponentProps,
          keyof JSX.IntrinsicElements
        >,
      }}
    />
  );
}

export interface PhoneInputProps {
  name: string;
  code: string;
  onChange: (ev: { target: { name: string; value: unknown } }) => void;
}
