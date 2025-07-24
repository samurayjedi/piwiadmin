import React, { useMemo } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  FormGroupProps,
  Radio,
  RadioGroup,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

export default function Options({ type, ...props }: OptionsProps) {
  const {
    options,
    label,
    name = '',
    value = type === 'check' ? [] : '',
    helperText = '',
    error = false,
    children,
    color = 'primary',
    onChange,
    disabled = false,
    ...rest
  } = props;
  const { t } = useTranslation();
  const { Group, Control } = useMemo(
    () => ({
      Group: type === 'check' ? FormGroup : RadioGroup,
      Control: type === 'check' ? Checkbox : Radio,
    }),
    [type],
  );

  return (
    <FormControl color={color} error={error} disabled={disabled}>
      <FormLabel>{label}</FormLabel>
      <Group
        {...rest}
        {...(type === 'radio' ? ({ name, value, onChange } as object) : {})}
      >
        {_.map(options, (opt, i) => {
          const v = Array.isArray(options) ? (opt as string) : (i as string);
          const l = opt as string;

          return (
            <React.Fragment key={`option-${_.snakeCase(v)}`}>
              <FormControlLabel
                label={t(l)}
                name={name}
                value={v}
                control={<Control color={color} name={name} />}
                {...(type === 'check'
                  ? {
                      checked: value ? value.includes(v) : undefined,
                      onChange,
                    }
                  : {})}
              />
              {children
                ? (() => {
                    const resultAttempt = _.attempt(children, v, i);

                    return !_.isError(resultAttempt) ? resultAttempt : null;
                  })()
                : null}
            </React.Fragment>
          );
        })}
      </Group>
      {Boolean(helperText) && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}

export interface OptionsProps
  extends Omit<FormGroupProps, 'children' | 'onChange'> {
  type: 'radio' | 'check';
  options: string[] | readonly string[] | Record<string, string>;
  label: React.ReactNode;
  name?: string;
  value?: string | string[];
  error?: boolean;
  helperText?: string;
  children?: (check: string, i: string | number) => React.ReactNode;
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  onChange?: (ev: unknown) => void;
}
