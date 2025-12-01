import React, { useMemo, useRef, useImperativeHandle } from 'react';
import { FormApi } from 'final-form';
import { Form, Field } from 'react-final-form';
import {
  Grid,
  IconButton,
  InputAdornment,
  TextFieldProps,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Select, { SelectProps } from '@/src/lib/piwi/core/Select';
import TextField, { type MockSearchForwardedRef } from './TextField';
import { useSearchErrors } from './hooks';

const subscription = { submitting: true, pristine: true };

export default React.forwardRef<SearchRef, SearchProps>(
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
      mockSearchDisabled = () => false,
      inputRef,
    },
    forwardedRef,
  ) => {
    const ref = useRef<MockSearchForwardedRef>(null);
    const formApiRef = useRef<FormApi | null>(null);
    const initialValues = useMemo(
      () => ({
        [name]: Array.isArray(items) ? items[0] : Object.keys(items)[0],
      }),
      [items, name],
    );
    const { errors, mockSearchFacade, submitFacade } = useSearchErrors(
      ref,
      name,
      onSubmit,
      mockSearch,
    );

    useImperativeHandle(forwardedRef, () => ({
      reset: () => {
        if (formApiRef.current) {
          formApiRef.current.reset();
        }
      },
    }));

    return (
      <Form
        initialValues={initialValues}
        subscription={subscription}
        onSubmit={submitFacade}
        render={({ /** pristine, */ handleSubmit, submitting, form }) => {
          formApiRef.current = form;

          return (
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
                          onChange={input.onChange}
                          error={Boolean(errors[input.name])}
                          helperText={
                            errors[input.name] ?? <Box sx={{ pb: 3 }} />
                          }
                        />
                      </Grid>
                      <Grid item xs={8} md={10}>
                        <Field
                          name={input.value ?? undefined}
                          subscription={{ value: true }}
                          render={(pollito) => (
                            <TextField
                              {...pollito.input}
                              ref={ref}
                              inputRef={inputRef}
                              variant={variant}
                              label={label}
                              fullWidth
                              color={color}
                              disabled={disabled}
                              onChange={pollito.input.onChange}
                              error={Boolean(errors[pollito.input.name])}
                              helperText={
                                errors[pollito.input.name] ?? (
                                  <Box sx={{ pb: 3 }} />
                                )
                              }
                              InputProps={{
                                readOnly: submitting,
                                inputProps: {
                                  autoComplete: 'off',
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
                              mockSearch={mockSearchFacade}
                              mockSearchDisabled={mockSearchDisabled(
                                input.value,
                              )}
                              onClickSuggestion={(item) => {
                                form.change('name', item);
                                if (!submitting) {
                                  form.submit();
                                }
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
          );
        }}
      />
    );
  },
);

export interface SearchRef {
  reset: () => void;
}

export interface SearchProps {
  label?: string;
  name?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  items: SelectProps['items'];
  onSubmit?: (field: string, value: string) => Promise<any>;
  disabled?: boolean;
  mockSearch: (s: string) => Promise<string[]>;
  inputRef?: TextFieldProps['inputRef'];
  mockSearchDisabled?: (selectedItem: string) => boolean;
}
