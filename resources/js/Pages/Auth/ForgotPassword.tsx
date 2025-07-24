import { route } from 'ziggy-js';
import { useTranslation } from 'react-i18next';
import { Link, router } from '@inertiajs/react';
import { Form, Field } from 'react-final-form';
import {
  TextField,
  Typography,
  InputAdornment,
  Button,
  Grid,
} from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon } from '@mui/icons-material';
import Layout from '@/src/Layouts/AuthLayout';
import { useErrors } from '@/hooks';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();

  return (
    <Layout>
      <Form
        subscription={{ submitting: true }}
        onSubmit={(data) =>
          new Promise<void>((resolve) =>
            router.post(route('password.email'), data, {
              onFinish: () => resolve(),
            }),
          )
        }
        render={({ submitting, handleSubmit }) => (
          <form className="auth-form-content" onSubmit={handleSubmit}>
            <Typography variant="subtitle1">
              {t(
                'Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.',
              )}
            </Typography>
            <div className="spacing" />
            <Field
              name="email"
              subscription={{ value: true, submitting: true }}
              render={({ input }) => (
                <TextField
                  {...input}
                  onChange={onChangeDecorator(input.onChange)}
                  label={t('Email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  color="secondary"
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                  disabled={submitting}
                />
              )}
            />
            <div className="spacing" />
            <Grid container justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                startIcon={<EmailIcon />}
                disabled={submitting}
              >
                {t('Send Reset Link')}
              </Button>
            </Grid>
          </form>
        )}
      />
      <div className="auth-form-footer">
        <Typography variant="subtitle1">
          {t('Are you remember?')}
          &nbsp;
          <Link href={route('login')}>{t('Login now!')}</Link>
        </Typography>
      </div>
    </Layout>
  );
}
