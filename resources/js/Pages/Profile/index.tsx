import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Container, Paper as MUIPaper, Typography } from '@mui/material';
import AppLayout from '@/src/Layouts/AppLayout';
import UpdateProfileInfoForm from './UpdateProfileInfoForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import DeleteAccount from './DeleteAccount';

export default function Profile({
  // auth,
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Paper>
          <Typography variant="h5" fontWeight="bold">
            {t('Profile Information')}
          </Typography>
          <Typography variant="subtitle1">
            {t("Update your account's profile information and email address.")}
          </Typography>
          <div className="spacing" />
          <UpdateProfileInfoForm
            status={status}
            mustVerifyEmail={mustVerifyEmail}
          />
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
      </Container>
    </AppLayout>
  );
}

const Paper = styled(MUIPaper)(({ theme }) => ({
  margin: `${theme.spacing(4)} 0`,
  padding: theme.spacing(2),
}));
