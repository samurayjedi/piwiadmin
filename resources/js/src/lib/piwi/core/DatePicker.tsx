import { TextFieldProps } from '@mui/material';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import { isValid } from 'date-fns';
import { format, parse } from '../dateFnsFacade';

export default function DatePicker({
  name = '',
  value = format(new Date()),
  onChange,
  disableFuture = false,
  disablePast = false,
  minDate,
  ...props
}: DatePickerProps) {
  return (
    <MuiDatePicker
      referenceDate={new Date()}
      name={name}
      value={parse(value)}
      disableFuture={disableFuture}
      disablePast={disablePast}
      minDate={minDate}
      onChange={(newDate) => {
        if (newDate && isValid(newDate)) {
          if (onChange) {
            onChange({
              target: {
                name,
                value: format(newDate),
              },
            });
          }
        }
      }}
      slotProps={{
        textField: { ...props, name },
      }}
    />
  );
}

export type DatePickerProps = Omit<TextFieldProps, 'value' | 'onChange'> & {
  value?: string;
  onChange?: (event: {
    target: {
      name: string;
      value: string;
    };
  }) => void;
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: Date | undefined;
};
