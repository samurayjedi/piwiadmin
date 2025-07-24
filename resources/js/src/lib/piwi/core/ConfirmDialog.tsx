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

  return (
    <Dialog {...props} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} variant="text" color="error">
          {t('Accept')}
        </Button>
        <Button onClick={onCancel} variant="text" color="success">
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface ConfirmDialogProps extends DialogProps {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}
