import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  Checkbox,
  Select,
  SelectProps,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

export default function SelectMultiple({
  items,
  value,
  onChange,
  ...props
}: SelectMultipleProps) {
  const { t } = useTranslation();
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  const handleRenderValue = useCallback(
    (selected: string[]) => {
      if (selected.length === 0) {
        return null;
      }

      return (
        <em>
          {selected.length}
          &nbsp;
          {t('items selected.')}
        </em>
      );
    },
    [t],
  );

  const handleChange = useCallback(
    (event: SelectChangeEvent<string[]>, child: React.ReactNode) => {
      const val = event.target.value;
      // On autofill we get a stringified value.
      const newVal = typeof val === 'string' ? val.split(',') : val;
      setSelectedValues(newVal);

      if (onChange) {
        onChange(event, child);
      }
    },
    [onChange],
  );

  return (
    <Select
      {...props}
      value={selectedValues}
      multiple
      displayEmpty
      renderValue={handleRenderValue}
      onChange={handleChange}
    >
      {_.map(items, (val, key) => {
        const v = Array.isArray(items) ? (val as string) : (key as string);
        const l = val as string;

        return (
          <MenuItem key={_.snakeCase(v)} value={v}>
            <Checkbox
              checked={selectedValues.indexOf(v) > -1}
              color={props.color}
            />
            {t(l)}
          </MenuItem>
        );
      })}
    </Select>
  );
}

export interface SelectMultipleProps
  extends Omit<SelectProps<string[]>, 'labelId'> {
  value: Array<string>;
  items: string[] | Record<string, string> | Readonly<string[]>;
}
