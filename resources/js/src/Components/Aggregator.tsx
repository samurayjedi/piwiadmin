import { useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import {
  Chip,
  TextField,
  TextFieldProps,
  IconButton,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

export default function Aggregator({
  name,
  value = [],
  onAdd,
  onRemove,
  renderMode = 'chip',
  ...rest
}: AggregatorProps) {
  const [itemToAdd, setItemToAdd] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onAddDecorator = useCallback(
    (val: string) => {
      if (onAdd) {
        onAdd(val);
      }

      setItemToAdd('');
    },
    [onAdd],
  );

  const onRemoveDecorator = useCallback(
    (i: number) => {
      if (onRemove) {
        onRemove(i);
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [onRemove],
  );

  return (
    <>
      <Box sx={{ flex: 1, display: 'flex', flexFlow: 'row nowrap' }}>
        <TextField
          {...rest}
          name={name}
          value={itemToAdd}
          onChange={(ev) => {
            setItemToAdd(ev.target.value);
          }}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault();
              const val = _.get(ev, 'target.value', '' as string);
              onAddDecorator(val);
            }
          }}
          onBlur={(ev) => {
            if (rest.onBlur) {
              rest.onBlur(ev);
            }
            if (inputRef.current) {
              const input = inputRef.current;
              if (input.value !== '') {
                onAddDecorator(input.value);
              }
            }
          }}
          inputRef={inputRef}
        />
        <IconButton
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
          disabled={rest.disabled}
        >
          <AddIcon />
        </IconButton>
      </Box>
      {value.length > 0 && (
        <>
          {renderMode === 'chip' && (
            <ChipList className="aggregator-chips">
              {value.map((val, i) => (
                <li key={`aggregator-item-${val}`} className="aggregator-chip">
                  <Chip
                    label={_.startCase(val)}
                    onDelete={() => {
                      onRemoveDecorator(i);
                    }}
                    disabled={rest.disabled}
                  />
                </li>
              ))}
            </ChipList>
          )}
          {renderMode === 'input' && (
            <InputList className="aggregator-inputs">
              {value.map((val, i) => (
                <li key={`aggregator-item-${val}`} className="aggregator-input">
                  <TextField variant="standard" value={val} disabled />
                  <IconButton
                    onClick={() => {
                      onRemoveDecorator(i);
                    }}
                    disabled={rest.disabled}
                  >
                    <ClearIcon />
                  </IconButton>
                </li>
              ))}
            </InputList>
          )}
        </>
      )}
    </>
  );
}

/** Types */

export interface AggregatorProps
  extends Omit<TextFieldProps, 'onChange' | 'name' | 'value'> {
  value?: Array<string>;
  name: string;
  renderMode?: 'chip' | 'input';
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
}

const ChipList = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  marginTop: theme.spacing(1),
  '& li': {
    marginRight: theme.spacing(1),
  },
  listStyle: 'none',
  paddingLeft: 0,
  paddingTop: theme.spacing(1),
  marginBottom: 0,
  '& .aggregator-chip': {
    marginBottom: theme.spacing(1),
  },
}));

const InputList = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(1),
  '& li': {
    display: 'flex',
    flexDirection: 'row',
    marginRight: theme.spacing(1),
    '& .MuiFormControl-root': {
      flex: 1,
    },
  },
  listStyle: 'none',
  paddingLeft: 0,
  paddingTop: theme.spacing(1),
  marginBottom: 0,
  '& .aggregator-inputs': {
    display: 'flex',
    flexDirection: 'column',
  },
}));
