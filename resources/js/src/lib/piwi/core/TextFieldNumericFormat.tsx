import React, { ElementType } from 'react';
import _ from 'lodash';
import {
  NumericFormat as SourceNumericFormat,
  NumericFormatProps as SourceNumericFormatProps,
} from 'react-number-format';
import {
  TextField,
  TextFieldProps,
  InputBaseComponentProps,
  FilledInputProps,
  OutlinedInputProps,
  InputProps,
} from '@mui/material';

function TextFieldNumericFormat({
  numericFormatProps,
  ...props
}: TextFieldNumericFormatProps) {
  const muiInputProps = _.defaultTo(props.InputProps, {});
  const inputProps = _.defaultTo(muiInputProps.inputProps, {});

  return (
    <TextField
      {...props}
      InputProps={{
        ...muiInputProps,
        inputComponent: NumericFormat as unknown as ElementType<
          InputBaseComponentProps,
          keyof JSX.IntrinsicElements
        >,
        inputProps: {
          ...inputProps,
          ...((numericFormatProps as unknown as object) ?? {}),
        },
      }}
    />
  );
}

export default TextFieldNumericFormat;

const NumericFormat = React.forwardRef<HTMLInputElement, NumericFormatProps>(
  ({ name = '', onChange, ...rest }, ref) => (
    <SourceNumericFormat
      {...rest}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name,
            value: values.value,
          },
        });
      }}
    />
  ),
);

interface NumericFormatProps extends SourceNumericFormatProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
}

export type TextFieldNumericFormatProps = Omit<TextFieldProps, 'InputProps'> & {
  InputProps?: MyInputProps;
  numericFormatProps?: SourceNumericFormatProps;
};

type MyInputProps =
  | Omit<Partial<FilledInputProps>, 'inputComponent'>
  | Omit<Partial<OutlinedInputProps>, 'inputComponent'>
  | Omit<Partial<InputProps>, 'inputComponent'>;
