import { route } from 'ziggy-js';
import { useTranslation } from 'react-i18next';
import { Link, router } from '@inertiajs/react';
import { Form, Field } from 'react-final-form';
import { FieldSubscription } from 'final-form';
import {
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Typography,
  Grid,
} from '@mui/material';
// Icons
import {
  VpnKey as VpnKeyIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  HowToReg as HowToRegIcon,
  AccountCircle as AccountCircleIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
} from '@mui/icons-material';
// Internal Dependencies
import TextFieldPassword from '@/src/lib/piwi/core/TextFieldPassword';
import Layout from '@/src/Layouts/AuthLayout';
import { useErrors } from '@/hooks';

export default function Register() {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const subscription: FieldSubscription = { value: true, submitting: true };

  return (
    <Layout>
      <Form
        onSubmit={(data) =>
          new Promise<void>((resolve) =>
            router.post(route('register'), data, { onFinish: () => resolve() }),
          )
        }
        subscription={{ submitting: true }}
        render={({ submitting, handleSubmit }) => (
          <form className="auth-form-content" onSubmit={handleSubmit}>
            <Field
              name="email"
              subscription={subscription}
              render={({ input }) => (
                <TextField
                  {...input}
                  label={t('Email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  color="secondary"
                  disabled={submitting}
                  onChange={onChangeDecorator(input.onChange)}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                />
              )}
            />
            <div className="spacing" />
            <Field
              name="name"
              subscription={subscription}
              render={({ input }) => (
                <TextField
                  {...input}
                  label={t('First & Last Name')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  color="secondary"
                  disabled={submitting}
                  onChange={onChangeDecorator(input.onChange)}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                />
              )}
            />
            <div className="spacing" />
            <Field
              name="password"
              subscription={subscription}
              render={({ input }) => (
                <TextFieldPassword
                  {...input}
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
                  disabled={submitting}
                  onChange={onChangeDecorator(input.onChange)}
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
                  disabled={submitting}
                  onChange={onChangeDecorator(input.onChange)}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                />
              )}
            />
            <div className="spacing" />
            <Grid container>
              <Grid item>
                <Tooltip title={t('Register via Google')}>
                  <IconButton disabled={submitting}>
                    <GoogleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('Register via Facebook')}>
                  <IconButton disabled={submitting}>
                    <FacebookIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid flex={1} />
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  startIcon={<HowToRegIcon />}
                  disabled={submitting}
                >
                  {t('Register')}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      />
      <div className="auth-form-footer">
        <Typography variant="subtitle1">
          {t('Already have one?')}
          &nbsp;
          <Link href={route('login')}>{t('Login now!')}</Link>
        </Typography>
      </div>
    </Layout>
  );
}

export interface SignUpForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
