import { useState } from 'react';
import _ from 'lodash';
import { route } from 'ziggy-js';
import { Form } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { Link, router } from '@inertiajs/react';
import { Alert, Collapse, Typography, Button, Grid } from '@mui/material';
import Layout from '@/src/Layouts/AuthLayout';

export default function VerifyEmail() {
  const { t } = useTranslation();
  const [openAlerts, setOpenAlerts] = useState(false);

  return (
    <Layout>
      <div className="auth-form-content">
        {openAlerts && (
          <>
            <Collapse in={openAlerts} className="alert">
              <Alert onClose={() => setOpenAlerts(false)}>
                {t(
                  'A new verification link has been sent to the email address you provided during registration.',
                )}
              </Alert>
            </Collapse>
            <div className="spacing" />
          </>
        )}
        <Typography variant="subtitle1">
          {t(
            'Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didnt receive the email, we will gladly send you another.',
          )}
        </Typography>
        <div className="spacing" />
        <Grid container>
          <Grid item>
            <Form
              subscription={{ submitting: true }}
              onSubmit={() =>
                new Promise<void>((resolve) =>
                  router.post(
                    route('verification.send'),
                    {},
                    {
                      onFinish: () => resolve(),
                      onSuccess: (page) => {
                        if (
                          (_.get(page, 'props.status', '') as string) ===
                          'verification-link-sent'
                        ) {
                          setOpenAlerts(true);
                        }
                      },
                    },
                  ),
                )
              }
              render={({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={submitting}
                  >
                    Resend Verification Email
                  </Button>
                </form>
              )}
            />
          </Grid>
          <Grid flex={1} />
          <Grid item>
            <Button
              color="inherit"
              LinkComponent={Link}
              href={route('logout')}
              {...{ method: 'post' }}
            >
              {t('Log Out')}
            </Button>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
}
