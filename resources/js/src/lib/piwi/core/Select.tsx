import { useMemo } from 'react';
import _ from 'lodash';
import {
  Select as MUISelect,
  SelectProps as MUISelectProps,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import SelectMultiple from './SelectMultiple';

export default function Select({
  label,
  items,
  helperText,
  sx,
  multiple,
  ...props
}: SelectProps) {
  const labelId = useMemo(() => _.uniqueId('select_label_'), []);

  return (
    <FormControl error={props.error} fullWidth={props.fullWidth} sx={sx}>
      {label && (
        <InputLabel id={labelId} sx={{ left: -14 }}>
          {label}
        </InputLabel>
      )}
      {multiple ? (
        <SelectMultiple
          {...props}
          value={(props.value as string[]) ?? []}
          defaultValue={(props.defaultValue as string[]) ?? []}
          multiple={multiple}
          items={items}
        />
      ) : (
        <MUISelect {...props} labelId={labelId}>
          {_.map(items, (value, key) => {
            const v = Array.isArray(items)
              ? (value as string)
              : (key as string);
            const l = value as string;

            return (
              <MenuItem key={_.snakeCase(v)} value={v}>
                {l}
              </MenuItem>
            );
          })}
        </MUISelect>
      )}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export type SelectProps = Omit<MUISelectProps, 'labelId'> & {
  items: string[] | Record<string, string> | Readonly<string[]>;
  label?: string;
  helperText?: string;
};
