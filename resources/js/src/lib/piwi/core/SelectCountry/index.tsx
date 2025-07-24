import _ from 'lodash';
import { css } from '@emotion/react';
import merge from 'lodash/merge';
import {
  Box,
  TextField,
  TextFieldProps,
  Autocomplete,
  AutocompleteProps,
} from '@mui/material';
import sourceCountries from './countries.json';
import sourceDialCodes from './countries_dialcodes.json';

export default function SelectCountry({
  name,
  value,
  textFieldProps,
  hideName,
  onChange,
  error = false,
  helperText = '',
  ...rest
}: SelectCountryProps) {
  const countries = sourceCountries as Record<string, string>;
  const dials = sourceDialCodes as Record<string, string>;

  return (
    <Autocomplete
      {...rest}
      onChange={(ev, country, reason, details) => {
        if (country && country !== '') {
          const fakeEv = {
            target: {
              name,
              value: country,
            },
          };
          if (onChange) {
            _.attempt(onChange, fakeEv, country, reason, details);
          }
        }
      }}
      options={Object.keys(countries)}
      value={value}
      autoHighlight
      getOptionLabel={(code) =>
        code
          ? ` (+${dials[code]}) ${!hideName ? `${countries[code]}` : ''}`
          : ''
      }
      renderOption={(optProps, code) => (
        <Box
          css={css({ '& > img': { marginRight: 16, flexShrink: 0 } })}
          component="li"
          {...optProps}
          key={`${code}-${dials[code]}`}
        >
          <Flag code={code} />
          {` (+${dials[code]})`}
          &nbsp;
          {!hideName && `${countries[code]}`}
        </Box>
      )}
      renderInput={(params) => {
        const newParams = merge(
          params,
          {
            InputProps: {
              startAdornment: value ? (
                <Flag code={value as string} />
              ) : undefined,
            },
            inputProps: {
              autoComplete: 'new-password',
            },
          },
          textFieldProps,
        );

        return (
          <TextField
            {...newParams}
            name={name}
            error={error}
            helperText={helperText}
          />
        );
      }}
    />
  );
}

function Flag({ code }: { code: string }) {
  return (
    <img
      loading="lazy"
      width="20"
      src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`}
      alt=""
    />
  );
}

export const dialCodes = sourceDialCodes as unknown as object;

type AutocompleteParams = AutocompleteProps<string, false, false, false>;

interface SelectCountryProps
  extends Omit<AutocompleteParams, 'renderInput' | 'options'> {
  name: string;
  textFieldProps: TextFieldProps;
  hideName?: boolean;
  error?: boolean;
  helperText?: string;
}
