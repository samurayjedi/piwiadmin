import { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import { router, usePage, Link } from '@inertiajs/react';
import { Form, Field } from 'react-final-form';
import {
  Grid,
  Collapse,
  Alert,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { useErrors } from '@/hooks';

export default function UpdateProfileInfoForm({
  mustVerifyEmail,
  status,
}: UpdateProfileInfoFormProps) {
  const { t } = useTranslation();
  const [openAlert, setOpenAlert] = useState(false);
  const [fuckErrors, onChangeDecorator] = useErrors();
  const {
    props: {
      auth: { user },
    },
  } = usePage<PageProps>();

  return (
    <>
      <Collapse in={openAlert}>
        <Alert onClose={() => setOpenAlert(false)} severity="success">
          {status}
        </Alert>
        <div className="spacing" />
      </Collapse>
      <Form
        initialValues={{ name: user.name, email: user.email }}
        subscription={{ submitting: true, pristine: true }}
        onSubmit={(data) =>
          new Promise<void>((resolve) =>
            router.patch(route('profile.update'), data, {
              onFinish: () => resolve(),
            }),
          )
        }
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field
                  name="name"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextField
                      {...input}
                      label={t('Name')}
                      fullWidth
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors[input.name])}
                      helperText={fuckErrors[input.name]}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} />
              <Grid item xs={6}>
                <Field
                  name="email"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextField
                      {...input}
                      label={t('Email')}
                      fullWidth
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors[input.name])}
                      helperText={fuckErrors[input.name]}
                      disabled={submitting}
                    />
                  )}
                />
              </Grid>
            </Grid>
            {mustVerifyEmail && user.email_verified_at === null && (
              <>
                <div className="spacing" />
                <ResendVerificationLink>
                  <Typography variant="subtitle1">
                    {t('Your email address is unverified.')}
                  </Typography>
                  <Button
                    variant="text"
                    LinkComponent={Link}
                    href={route('verification.send')}
                  >
                    {t('Re-send the verification email.')}
                  </Button>
                </ResendVerificationLink>
              </>
            )}
            <div className="spacing" />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={submitting || pristine}
            >
              {t('Save')}
            </Button>
          </form>
        )}
      />
    </>
  );
}

const ResendVerificationLink = styled.div({
  display: 'flex',
  alignItems: 'center',
});

interface UpdateProfileInfoFormProps {
  mustVerifyEmail: boolean;
  status?: string;
}
