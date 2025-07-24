import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { route } from 'ziggy-js';
import { router } from '@inertiajs/react';
import { Form, Field } from 'react-final-form';
import {
  Button,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useErrors } from '@/hooks';
import TextFieldPassword from '@/src/lib/piwi/core/TextFieldPassword';

export default function DeleteAccount() {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullscreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [fuckErrors, onChangeDecorator] = useErrors();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="contained" color="error" onClick={() => setOpen(true)}>
        {t('Delete Account')}
      </Button>
      <Dialog open={open} fullScreen={fullscreen} onClose={handleClose}>
        <DialogTitle>
          {t('Are you sure you want to delete your account?')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              'Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.',
            )}
          </DialogContentText>
          <div className="spacing" />
          <Form
            subscription={{ submitting: true, pristine: true }}
            onSubmit={(data) =>
              new Promise<void>((resolve) =>
                router.delete(route('profile.destroy', data), {
                  onFinish: () => resolve(),
                }),
              )
            }
            render={({ submitting, handleSubmit }) => (
              <form ref={formRef} onSubmit={handleSubmit}>
                <Field
                  name="password"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextFieldPassword
                      {...input}
                      label={t('Password')}
                      fullWidth
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors[input.name])}
                      helperText={fuckErrors[input.name]}
                      disabled={submitting}
                    />
                  )}
                />
              </form>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <Button
            color="error"
            onClick={() => {
              if (formRef.current) {
                formRef.current.requestSubmit();
              }
            }}
          >
            {t('Delete it!!')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
