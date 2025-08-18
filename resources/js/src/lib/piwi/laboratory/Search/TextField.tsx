import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import styled from '@emotion/styled';
import {
  TextField as MUITextField,
  ClickAwayListener,
  List,
  ListItemText,
  ListItemButton,
  ListSubheader,
} from '@mui/material';
import Popper from '../../core/Popper';

export default function TextField({
  mockSearch,
  onClickSuggestion,
  mockSearchDisabled,
  ...props
}: TextFieldProps & { mockSearchDisabled?: boolean }) {
  if (mockSearchDisabled) {
    return <StyledTextField {...props} />;
  }

  return (
    <TextFieldMockSearch
      {...props}
      mockSearch={mockSearch}
      onClickSuggestion={onClickSuggestion}
    />
  );
}

function TextFieldMockSearch({
  mockSearch,
  onClickSuggestion,
  value,
  onChange,
  ...props
}: TextFieldProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState<string>(value);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce function to limit API calls
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputValue.length >= 3) {
        setIsLoading(true);
        const results = await mockSearch(inputValue);
        setSearchResults(results);
        setIsLoading(false);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [inputValue, mockSearch]);

  const open =
    Boolean(anchorEl) && inputValue.length >= 3 && searchResults.length > 0;
  const id = open ? 'search-popper' : undefined;

  return (
    <ClickAwayListener
      onClickAway={() => {
        setAnchorEl(null);
      }}
    >
      <div>
        <StyledTextField
          {...props}
          aria-describedby={id}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
            setAnchorEl(event.currentTarget);
            if (onChange) {
              onChange(event);
            }
          }}
        />
        <Popper
          id={id}
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
        >
          <List
            dense
            subheader={<ListSubheader>{t('Suggestions')}</ListSubheader>}
          >
            {!isLoading &&
              searchResults.map((item) => (
                <ListItemButton
                  key={`pre_result_${_.snakeCase(item)}`}
                  onClick={() => {
                    setInputValue(item);
                    setAnchorEl(null);
                    if (onClickSuggestion) {
                      onClickSuggestion(item);
                    }
                  }}
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              ))}
          </List>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

type MUITextFieldProps = React.ComponentProps<typeof MUITextField>;
type TextFieldProps = MUITextFieldProps & {
  value: string;
  mockSearch: (s: string) => Promise<string[]>;
  onClickSuggestion?: (s: string) => void;
  onChange: MUITextFieldProps['onChange'];
};

const StyledTextField = styled(MUITextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeftWidth: 0,
    },
    '&:hover fieldset': {
      borderLeftWidth: 0, // Ensure left border stays hidden on hover
    },
    '&.Mui-focused fieldset': {
      borderLeftWidth: 0, // Ensure left border stays hidden when focused
    },
  },
  '& .MuiFilledInput-root': {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    '&:before, &:after': {
      borderLeft: 'none', // Remove left border completely
    },
  },
});
