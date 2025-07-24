import clsx from 'clsx';
import React, {
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
  useContext,
} from 'react';
import _ from 'lodash';
import { css, Theme } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { IconButton, Typography } from '@mui/material';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import DoneIcon from '@mui/icons-material/Done';
import { MultipleInputFileContext } from './InputFileGroup';

export default function InputFile({
  label = '',
  onChange,
  error = false,
  helperText,
  value = '',
  ...rest
}: InputFileProps) {
  const { t } = useTranslation();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [filesSelected, setFilesSelected] = useState(0);
  const id = useMemo(() => _.uniqueId('input-file-'), []);
  const groupProps = useContext(MultipleInputFileContext);
  const props = _.defaults(rest, groupProps);

  useLayoutEffect(() => {
    if (inputFileRef.current) {
      setFilesSelected(inputFileRef.current.files?.length || 0);
    }
  }, [value]);

  return (
    <>
      <label
        css={inputUploadFile}
        className={clsx({ disabled: props.disabled })}
        htmlFor={id}
      >
        <input
          {...props}
          value={value}
          id={id}
          type="file"
          ref={inputFileRef}
          onChange={(ev) => {
            if (inputFileRef.current) {
              setFilesSelected(inputFileRef.current.files?.length || 0);
            }
            if (onChange) {
              onChange(ev);
            }
          }}
        />
        <IconButton
          aria-label="upload documents"
          component="span"
          size="large"
          color={error ? 'error' : 'inherit'}
        >
          {!filesSelected ? (
            <DocumentScannerIcon />
          ) : (
            <DoneIcon color="success" />
          )}
        </IconButton>
        <Typography
          variant="subtitle2"
          gutterBottom
          color={error ? 'error' : 'inherit'}
        >
          {!filesSelected
            ? label || t('Click for upload files')
            : `${filesSelected} ${t('selected')}`}
        </Typography>
      </label>
      <Typography
        variant="subtitle2"
        sx={{ display: error ? 'block' : 'none', pl: 1 }}
        color="error"
      >
        {helperText}
      </Typography>
    </>
  );
}

export interface InputFileProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'label'> {
  label?: string | null;
  error?: boolean;
  helperText?: string;
}

const inputUploadFile = (theme: Theme) =>
  css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&.disabled': {
      color: theme.palette.action.disabled,
    },
    '& input': {
      display: 'none',
    },
    '& .MuiTypography-root': {
      marginTop: 8,
    },
  });
