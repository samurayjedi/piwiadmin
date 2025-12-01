import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@mui/material';

export default function ConfirmDialog({
  title,
  message,
  onConfirm = () => {},
  onCancel = () => {},
  ...props
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(false);

  return (
    <Dialog
      {...props}
      onClose={() => {
        if (!disabled) {
          onCancel();
        }
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onConfirm(setDisabled)}
          variant="text"
          color="error"
          disabled={disabled}
        >
          {t('Accept')}
        </Button>
        <Button
          onClick={onCancel}
          variant="text"
          color="success"
          disabled={disabled}
        >
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface ConfirmDialogProps extends DialogProps {
  title: string;
  message: string;
  onConfirm?: (disabled: Dispatch<SetStateAction<boolean>>) => void;
  onCancel?: () => void;
}
