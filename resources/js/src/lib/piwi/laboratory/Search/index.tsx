import React, { useCallback, useMemo } from 'react';
import { Form, Field, FormProps } from 'react-final-form';
import { Grid, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Select, { SelectProps } from '@/src/lib/piwi/core/Select';
import { useErrors } from '@/hooks';
import TextField from './TextField';

const subscription = { submitting: true, pristine: true };
export default React.forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      items,
      color = 'primary',
      variant = 'standard',
      onSubmit,
      label,
      name = 'field',
      disabled = false,
      mockSearch,
    },
    ref,
  ) => {
    const [fuckErrors, onChangeDecorator] = useErrors();
    const initialValues = useMemo(
      () => ({
        [name]: Array.isArray(items) ? items[0] : Object.keys(items)[0],
      }),
      [items, name],
    );
    const handleSubmitVaca = useCallback<FormProps['onSubmit']>(
      (data) => {
        if (onSubmit) {
          const namae = data[name];
          const value = data[namae];

          return onSubmit(namae, value);
        }

        return new Promise<void>((resolve) => {
          resolve();
        });
      },
      [name, onSubmit],
    );

    return (
      <Form
        initialValues={initialValues}
        subscription={subscription}
        onSubmit={handleSubmitVaca}
        render={({ /** pristine, */ handleSubmit, submitting, form }) => (
          <form method="POST" onSubmit={handleSubmit}>
            <Grid container>
              <Field
                name={name}
                subscription={{ value: true }}
                render={({ input }) => (
                  <>
                    <Grid
                      item
                      xs={4}
                      md={2}
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        flexDirection: 'column',
                      }}
                    >
                      <Select
                        {...input}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            },
                          },
                          '& .MuiFilledInput-root': {
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            '&:before, &:after': {
                              borderRight: 'none', // Remove left border completely
                            },
                          },
                        }}
                        items={items}
                        variant={variant}
                        fullWidth
                        color={color}
                        disabled={submitting || disabled}
                        onChange={onChangeDecorator(input.onChange)}
                        error={Boolean(fuckErrors[input.name])}
                        helperText={fuckErrors[input.name] ?? '_'}
                      />
                    </Grid>
                    <Grid item xs={8} md={10}>
                      <Field
                        name={input.value ?? undefined}
                        subscription={{ value: true }}
                        render={(pollito) => (
                          <TextField
                            {...pollito.input}
                            inputRef={ref}
                            variant={variant}
                            label={label}
                            fullWidth
                            color={color}
                            disabled={submitting || disabled}
                            onChange={onChangeDecorator(pollito.input.onChange)}
                            error={Boolean(fuckErrors[pollito.input.name])}
                            helperText={fuckErrors[pollito.input.name] ?? '_'}
                            InputProps={{
                              inputProps: {
                                autocomplete: 'off',
                              },
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    type="submit"
                                    disabled={submitting || disabled}
                                  >
                                    <SearchIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            mockSearch={mockSearch}
                            mockSearchDisabled={input.value !== 'name'}
                            onClickSuggestion={(item) => {
                              form.change('name', item);
                              form.submit();
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}
              />
            </Grid>
          </form>
        )}
      />
    );
  },
);

export interface SearchProps {
  label?: string;
  name?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  items: SelectProps['items'];
  onSubmit?: (field: string, value: string) => Promise<any>;
  disabled?: boolean;
  mockSearch: (s: string) => Promise<string[]>;
}
