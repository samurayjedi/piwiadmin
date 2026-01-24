import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  Paper as MUIPaper,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppLayout from '@/src/Layouts/AppLayout';
import UpdateProfileInfoForm from './UpdateProfileInfoForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import DeleteAccount from './DeleteAccount';
import BusinessForm from './BusinessForm';
import Alerts from '../Auth/Alerts';

export default function Profile({
  // auth,
  mustVerifyEmail,
  goauth,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
  goauth: boolean;
}) {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <Alerts status={status ?? ''} noMargin />
      <Paper>
        <Typography variant="h5" fontWeight="bold">
          {t('Business information')}
        </Typography>
        <Typography variant="subtitle1">
          {t('Update your business logo and other information.')}
        </Typography>
        <div className="spacing" />
        <BusinessForm />
      </Paper>
      <Paper>
        <Typography variant="h5" fontWeight="bold">
          {t('Profile Information')}
        </Typography>
        <Typography variant="subtitle1">
          {t("Update your account's profile information and email address.")}
        </Typography>
        <div className="spacing" />
        <UpdateProfileInfoForm mustVerifyEmail={mustVerifyEmail} />
      </Paper>
      <Paper>
        <Typography variant="h5" fontWeight="bold">
          {t('Update Password')}
        </Typography>
        <Typography variant="subtitle1">
          {t(
            'Ensure your account is using a long, random password to stay secure.',
          )}
        </Typography>
        <div className="spacing" />
        <UpdatePasswordForm />
      </Paper>
      {!goauth && (
        <Paper>
          <Typography variant="h5" fontWeight="bold">
            {t('Link account')}
          </Typography>
          <Typography variant="subtitle1">
            {t('Link account with google for easy access.')}
          </Typography>
          <Tooltip title={t('Login via Google')}>
            <IconButton
              size="large"
              href={route('google.login', { action: 'link' })}
            >
              <GoogleIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Paper>
      )}
      <Paper>
        <Typography variant="h5" fontWeight="bold">
          {t('Delete Account')}
        </Typography>
        <Typography variant="subtitle1">
          {t(
            'Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.',
          )}
        </Typography>
        <div className="spacing" />
        <DeleteAccount />
      </Paper>
    </AppLayout>
  );
}

const Paper = styled(MUIPaper)(({ theme }) => ({
  margin: `${theme.spacing(4)} 0`,
  padding: theme.spacing(2),
}));
