import React, { ElementType } from 'react';
import _ from 'lodash';
import { type AllFactoryStaticOpts } from 'imask';
import { IMaskInput, IMaskInputProps } from 'react-imask';
import {
  TextField,
  TextFieldProps,
  InputBaseComponentProps,
} from '@mui/material';

export default function TextFieldMasked({
  mask,
  definitions,
  blocks,
  overwrite,
  InputProps,
  inputRef,
  ...rest
}: TextFieldMaskedProps) {
  const muiInputProps = _.defaultTo(InputProps, {});
  const inputProps = _.defaultTo(muiInputProps.inputProps, {});

  return (
    <TextField
      {...rest}
      InputProps={{
        ...muiInputProps,
        inputComponent: MaskedZipInput as unknown as ElementType<
          InputBaseComponentProps,
          keyof JSX.IntrinsicElements
        >,
        inputProps: {
          ...inputProps,
          mask,
          definitions,
          blocks,
          overwrite,
          inputRef,
        },
      }}
    />
  );
}

function MaskedZipInput({ onChange, ...rest }: MaskInputProps) {
  return (
    <IMaskInput
      {...rest}
      onAccept={(value) => {
        if (onChange) {
          onChange({ target: { name: rest.name, value } });
        }
      }}
    />
  );
}

export interface MaskInputProps {
  name: string;
  onChange?: (ev: { target: { name: string; value: unknown } }) => void;
  mask: string;
  definitions: Record<string, RegExp>;
}

export type TextFieldMaskedProps = TextFieldProps & {
  mask: string;
  definitions: Record<string, RegExp>;
  overwrite?: IMaskInputProps<HTMLInputElement>['overwrite'];
  blocks?: AllFactoryStaticOpts['blocks'];
};
