import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  useRef,
} from 'react';
import styled from '@emotion/styled';
import { IconButton, TextFieldProps } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TextFieldNumericFormat, {
  TextFieldNumericFormatProps,
} from './TextFieldNumericFormat';

const parseValue = (v: any, min: number, max: number) => {
  const newV = parseFloat(v);
  if (isNaN(newV)) {
    return '' as unknown as number;
  }

  return Math.max(min, Math.min(max, newV));
};
export default function Spinner({
  value = 0,
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
  const [v, setV] = useState<number>(parseValue(value, min, max));

  useEffect(() => {
    setV(parseValue(value, min, max));
  }, [value, min, max]);

  const increment = useCallback(() => {
    setV((x) => Math.min(max, x + step));
    if (iRef.current) {
      iRef.current.focus();
    }
  }, [iRef, max, step]);

  const decrement = useCallback(() => {
    setV((x) => Math.max(min, x - step));
    if (iRef.current) {
      iRef.current.focus();
    }
  }, [iRef, min, step]);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setV(parseValue(ev.target.value, min, max));
      if (onChange) {
        onChange(ev);
      }
    },
    [onChange, min, max],
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
        value={v.toString()}
        onChange={handleChange}
      />
      <IconButton size="small" onClick={increment} sx={{ ml: 1 }}>
        <AddCircleOutlineIcon />
      </IconButton>
    </Container>
  );
}

export type QuantityProps = Omit<TextFieldProps, 'value'> & {
  step?: number;
  value?: number;
  min?: number;
  max?: number;
  numericFormatProps?: TextFieldNumericFormatProps['numericFormatProps'];
};

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});
