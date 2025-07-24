import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import { Link, usePage, router } from '@inertiajs/react';
import { Form, Field } from 'react-final-form';
import { FieldSubscription } from 'final-form';
import {
  TextField,
  Typography,
  Tooltip,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Button,
  IconButton,
  Grid,
  Alert,
  Collapse,
} from '@mui/material';
import {
  Person as PersonIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  LockOpen as LockOpenIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { useErrors } from '@/hooks';
import TextFieldPassword from '@/src/lib/piwi/core/TextFieldPassword';
import Layout from '@/src/Layouts/AuthLayout';

export default function LoginForm({ status }: { status: string }) {
  const [openAlert, setOpenAlert] = useState(Boolean(status));
  const { canResetPassword } = usePage().props;
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const subscription: FieldSubscription = { value: true, submitting: true };

  useEffect(() => setOpenAlert(Boolean(status)), [status]);

  return (
    <Form
      subscription={{ submitting: true }}
      onSubmit={(data) =>
        new Promise<void>((resolve) =>
          router.post(route('login'), data, {
            onFinish: () => resolve(),
          }),
        )
      }
      render={({ submitting, handleSubmit }) => (
        <Layout>
          <form className="auth-form-content" onSubmit={handleSubmit}>
            <Collapse in={openAlert}>
              <Alert onClose={() => setOpenAlert(false)}>{status}</Alert>
              <div className="spacing" />
            </Collapse>
            <Field
              name="email"
              subscription={subscription}
              render={({ input }) => (
                <TextField
                  {...input}
                  id="signin-user"
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
                  onChange={onChangeDecorator(input.onChange)}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                  disabled={submitting}
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
                  onChange={onChangeDecorator(input.onChange)}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                  disabled={submitting}
                />
              )}
            />
            <Grid container alignItems="center">
              <Grid item>
                <Field
                  name="remember"
                  subscription={subscription}
                  render={({ input }) => (
                    <FormControlLabel
                      name={input.name}
                      label={t('Remember me')}
                      control={
                        <Checkbox
                          checked={input.value}
                          onChange={input.onChange}
                          color="secondary"
                        />
                      }
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>
              <Grid item flex={1} />
              <Grid item>
                {canResetPassword === true && (
                  <Link href="/forgot-password">
                    {t('Forgot your password?')}
                  </Link>
                )}
              </Grid>
            </Grid>
            <div className="spacing" />
            <Grid container>
              <Grid item>
                <Tooltip title={t('Login via Google')}>
                  <IconButton disabled={submitting}>
                    <GoogleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('Login via Facebook')}>
                  <IconButton disabled={submitting}>
                    <FacebookIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item flex={1} />
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  startIcon={<LockOpenIcon />}
                  disabled={submitting}
                >
                  {t('Login')}
                </Button>
              </Grid>
            </Grid>
          </form>
          <div className="auth-form-footer">
            <Typography variant="subtitle1">
              {t('No account?')}
              &nbsp;
              <Link href="/register">{t('Create one now!')}</Link>
            </Typography>
          </div>
        </Layout>
      )}
    />
  );
}
