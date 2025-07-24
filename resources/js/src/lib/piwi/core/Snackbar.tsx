import React, { SyntheticEvent } from 'react';
import {
  Snackbar as MuiSnackbar,
  Alert,
  AlertProps,
  SnackbarProps as MuiSnackbarProps,
} from '@mui/material';

export default function Snackbar({
  severity = 'success',
  autoHideDuration = 6000,
  onClose,
  children,
  ...props
}: SnackbarProps) {
  return (
    <MuiSnackbar
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      {...props}
    >
      <Alert
        severity={severity}
        onClose={
          onClose as
            | ((event: SyntheticEvent<Element, Event>) => void)
            | undefined
        }
        sx={{ width: '100%' }}
      >
        {children}
      </Alert>
    </MuiSnackbar>
  );
}

export interface SnackbarProps extends Omit<MuiSnackbarProps, 'children'> {
  severity?: AlertProps['severity'];
  children: React.ReactNode;
}
