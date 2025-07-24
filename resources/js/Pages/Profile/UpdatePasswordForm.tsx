import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import { router } from '@inertiajs/react';
import { Form, Field } from 'react-final-form';
import { Grid, Button, Alert, Collapse } from '@mui/material';
import { useErrors } from '@/hooks';
import TextFieldPassword from '@/src/lib/piwi/core/TextFieldPassword';

export default function UpdatePasswordForm() {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [fuckErrors, onChangeDecorator] = useErrors();
  const [openAlert, setOpenAlert] = useState(false);

  return (
    <>
      <Collapse in={openAlert}>
        <Alert onClose={() => setOpenAlert(false)} severity="success">
          The Password has been updated.
        </Alert>
        <div className="spacing" />
      </Collapse>
      <Form
        subscription={{ submitting: true, pristine: true }}
        onSubmit={(data, form) =>
          new Promise<void>((resolve) =>
            router.put(route('password.update'), data, {
              onFinish: () => {
                resolve();
                if (formRef.current) {
                  formRef.current.scrollIntoView({ behavior: 'instant' });
                }
              },
              onSuccess: () => {
                setOpenAlert(true);
                form.reset();
              },
            }),
          )
        }
        render={({ handleSubmit, submitting, pristine }) => (
          <form ref={formRef} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field
                  name="current_password"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextFieldPassword
                      {...input}
                      label={t('Current Password')}
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
                  name="password"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextFieldPassword
                      {...input}
                      label={t('New Password')}
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
                  name="password_confirmation"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextFieldPassword
                      {...input}
                      label={t('Confirm Password')}
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
            <div className="spacing" />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={submitting || pristine}
            >
              {t('Update')}
            </Button>
          </form>
        )}
      />
    </>
  );
}
