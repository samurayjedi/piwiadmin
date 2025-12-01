import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
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

export default React.forwardRef<MockSearchForwardedRef, TextFieldProps>(
  ({ mockSearchDisabled, ...props }, forwardedRef) => {
    if (mockSearchDisabled) {
      return <StyledTextField {...props} />;
    }

    return <TextFieldMockSearch {...props} ref={forwardedRef} />;
  },
);

const TextFieldMockSearch = React.forwardRef<
  MockSearchForwardedRef,
  MockSearchTextFieldProps
>(({ mockSearch, onClickSuggestion, value, onChange, ...props }, ref) => {
  const { t } = useTranslation();
  const suggClicked = useRef(false);
  const [inputValue, setInputValue] = useState<string>(value);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce function to limit API calls
  useEffect(() => {
    if (suggClicked.current === true) {
      suggClicked.current = false;

      return () => {};
    }

    const timer = setTimeout(async () => {
      if (anchorEl !== null && inputValue.length >= 3) {
        setIsLoading(true);
        try {
          const results = await mockSearch(inputValue);
          setSearchResults(results);
        } catch (err) {
          setSearchResults([]);
        }
        setIsLoading(false);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [anchorEl, inputValue, mockSearch]);

  const open =
    Boolean(anchorEl) && inputValue.length >= 3 && searchResults.length > 0;
  const id = open ? 'search-popper' : undefined;

  useImperativeHandle(ref, () => ({
    emptyResults: () => setSearchResults([]),
  }));

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
            if (event.target.value.length >= 3) {
              setAnchorEl(event.currentTarget);
            }
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
                    suggClicked.current = true;
                    setInputValue(item);
                    if (onClickSuggestion) {
                      onClickSuggestion(item);
                    }
                    setAnchorEl(null);
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
});

export interface MockSearchProps {
  value: string;
  mockSearch: (s: string) => Promise<string[]>;
  onClickSuggestion?: (s: string) => void;
  onChange: MUITextFieldProps['onChange'];
}

type MUITextFieldProps = React.ComponentProps<typeof MUITextField>;
type MockSearchTextFieldProps = MUITextFieldProps & MockSearchProps;
type TextFieldProps = MockSearchTextFieldProps & {
  mockSearchDisabled?: boolean;
};

export interface MockSearchForwardedRef {
  emptyResults: () => void;
}

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
