import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useMediaQuery,
  Button,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Client } from '../Clients';

export default function ClientInfoDialog({
  client,
  onClose = () => {},
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={Boolean(client)}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      keepMounted
    >
      <DialogTitle>{client?.name}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">
          <strong>{t('Identification')}: &nbsp;</strong>
          {client?.identification}
        </Typography>
        <Typography variant="subtitle1">
          <strong>{t('Phone')}: &nbsp;</strong>
          {client?.phone}
        </Typography>
        <Typography variant="subtitle1">
          <strong>{t('Address')}: &nbsp;</strong>
          {client?.address}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="primary" onClick={onClose}>
          {t('Ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface ConfirmDialogProps {
  client?: Client;
  onClose?: () => void;
}
