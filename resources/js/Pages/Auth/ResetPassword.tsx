import { route } from 'ziggy-js';
import { Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Form, Field } from 'react-final-form';
import { FieldSubscription } from 'final-form';
import {
  InputAdornment,
  Button,
  Grid,
  Typography,
  Collapse,
  Alert,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';
import TextFieldPassword from '@/src/lib/piwi/core/TextFieldPassword';
import { useErrors } from '@/hooks';
import Layout from '@/src/Layouts/AuthLayout';

export default function ResetPassword({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator, removeError] = useErrors();
  const subscription: FieldSubscription = { value: true, submitting: true };

  return (
    <Layout>
      <Form
        subscription={{ pristine: true, submitting: true }}
        onSubmit={(data) =>
          new Promise<void>((resolve) =>
            router.post(
              route('password.store'),
              { ...data, email, token },
              { onFinish: () => resolve() },
            ),
          )
        }
        render={({ submitting, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="auth-form-content">
              <Collapse in={Boolean(fuckErrors.email)}>
                <Alert onClose={() => removeError('email')} severity="error">
                  {fuckErrors.email}
                </Alert>
                <div className="spacing" />
              </Collapse>
              <Field
                name="password"
                subscription={subscription}
                render={({ input }) => (
                  <TextFieldPassword
                    {...input}
                    onChange={onChangeDecorator(input.onChange)}
                    label={t('Password')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    color="secondary"
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                  />
                )}
              />
              <div className="spacing" />
              <Field
                name="password_confirmation"
                subscription={subscription}
                render={({ input }) => (
                  <TextFieldPassword
                    {...input}
                    onChange={onChangeDecorator(input.onChange)}
                    label={t('Verify Password')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    color="secondary"
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                  />
                )}
              />
              <div className="spacing" />
              <Grid container justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  startIcon={<LockResetIcon />}
                  disabled={submitting}
                >
                  {t('Reset Password')}
                </Button>
              </Grid>
            </div>
            <div className="spacing" />
            <div className="auth-form-footer">
              <Typography variant="subtitle1">
                {t('Are you remember?')}
                &nbsp;
                <Link href={route('login')}>{t('Login now!')}</Link>
              </Typography>
            </div>
          </form>
        )}
      />
    </Layout>
  );
}

export interface ResetPasswordForm {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}
