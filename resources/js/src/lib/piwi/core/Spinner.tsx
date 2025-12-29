import React, { useCallback, ChangeEvent, useRef } from 'react';
import styled from '@emotion/styled';
import { IconButton, TextFieldProps } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TextFieldNumericFormat, {
  TextFieldNumericFormatProps,
} from './TextFieldNumericFormat';

export default function Spinner({
  step = 1,
  onChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  inputRef,
  onKeyDown,
  ...props
}: QuantityProps) {
  const ref = useRef<HTMLInputElement>();
  const iRef = (inputRef ?? ref) as React.MutableRefObject<
    HTMLInputElement | undefined
  >;
  const increment = useCallback(() => {
    if (iRef.current) {
      iRef.current.focus();
      // changing value
      const x = parseFloat(iRef.current.value ?? 0);
      const nv = Math.min(max, x + step);
      if (onChange) {
        onChange({
          target: { value: nv.toString() },
          currentTarget: { value: nv.toString() },
        } as unknown as any);
      }
      iRef.current.value = nv.toString();
    }
  }, [iRef, max, onChange, step]);

  const decrement = useCallback(() => {
    if (iRef.current) {
      iRef.current.focus();
      // changing value
      const x = parseFloat(iRef.current.value ?? 0);
      const nv = Math.max(min, x - step);
      if (onChange) {
        onChange({
          target: { value: nv.toString() },
          currentTarget: { value: nv.toString() },
        } as unknown as any);
      }
      iRef.current.value = nv.toString();
    }
  }, [iRef, min, onChange, step]);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (onChange) {
        onChange(ev);
      }
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === '+' || event.key === '-') {
        if (event.key === '+') {
          increment();
        } else if (event.key === '-') {
          decrement();
        }
      }

      if (onKeyDown) {
        onKeyDown(event);
      }
    },
    [decrement, increment, onKeyDown],
  );

  return (
    <Container>
      <IconButton size="small" onClick={decrement} sx={{ mr: 1 }}>
        <RemoveCircleOutlineIcon />
      </IconButton>
      <TextFieldNumericFormat
        {...props}
        onKeyDown={handleKeyDown}
        inputRef={iRef}
        onChange={handleChange}
        numericFormatProps={{
          ...(props.numericFormatProps && props.numericFormatProps),
          isAllowed: (_) => {
            if (!_.value) {
              return true;
            }
            const converted = parseFloat(_.value);
            const another = props.numericFormatProps?.isAllowed
              ? props.numericFormatProps.isAllowed(_)
              : true;

            return converted >= min && converted <= max && another;
          },
        }}
      />
      <IconButton size="small" onClick={increment} sx={{ ml: 1 }}>
        <AddCircleOutlineIcon />
      </IconButton>
    </Container>
  );
}

export type QuantityProps = TextFieldProps & {
  step?: number;
  min?: number;
  max?: number;
  numericFormatProps?: TextFieldNumericFormatProps['numericFormatProps'];
};

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});
