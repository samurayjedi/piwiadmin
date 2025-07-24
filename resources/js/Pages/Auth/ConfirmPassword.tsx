import { route } from 'ziggy-js';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { Head, router } from '@inertiajs/react';
import { Button, Typography, InputAdornment, Grid } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material/';
import TextFieldPassword from '@/src/lib/piwi/core/TextFieldPassword';
import Layout from '@/src/Layouts/AuthLayout';
import { useErrors } from '@/hooks';

export default function ConfirmPassword() {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();

  return (
    <>
      <Head title={t('Confirm Password')} />
      <Layout>
        <Form
          subscription={{ submitting: true, pristine: true }}
          onSubmit={(data) =>
            new Promise<void>((resolve) =>
              router.post(route('password.confirm'), data, {
                onFinish: () => resolve(),
              }),
            )
          }
          render={({ submitting, pristine, handleSubmit }) => (
            <form className="auth-form-content" onSubmit={handleSubmit}>
              <Typography variant="subtitle1">
                {t(
                  'This is a secure area of the application. Please confirm your password before continuing.',
                )}
              </Typography>
              <div className="spacing" />
              <Field
                name="password"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextFieldPassword
                    {...input}
                    label={t('Password')}
                    onChange={onChangeDecorator(input.onChange)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    color="secondary"
                    error={Boolean(fuckErrors.password)}
                    helperText={fuckErrors.password}
                    disabled={submitting}
                  />
                )}
              />
              <div className="spacing" />
              <Grid container>
                <Grid item flex={1} />
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={submitting || pristine}
                  >
                    {t('Confirm')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        />
        <div className="auth-form-footer">
          <Button
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
          >
            {t('Go Back')}
          </Button>
        </div>
      </Layout>
    </>
  );
}
