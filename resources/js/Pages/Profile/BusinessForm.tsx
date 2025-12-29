import { useRef } from 'react';
import { Form, Field } from 'react-final-form';
import {
  TextField,
  InputAdornment,
  Grid,
  Typography,
  Button,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { useAppPage, useErrors } from '@/hooks';
import { useTranslation } from 'react-i18next';
import InputFile from '@/src/lib/piwi/core/InputFile';
import Gap from '@/src/lib/piwi/common/Gap';
import { router } from '@inertiajs/react';

export default function BusinessForm() {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const ref = useRef<HTMLFormElement>(null);
  const {
    props: { business_name },
  } = useAppPage();

  return (
    <Form
      initialValues={{ business_name }}
      subscription={{ submitting: true, pristine: true }}
      onSubmit={() =>
        new Promise<void>((resolve) => {
          if (ref.current) {
            const formData = new FormData(ref.current);
            router.post(route('profile.update-business-info'), formData, {
              forceFormData: true,
              onFinish: () => resolve(),
              onSuccess: () => location.reload(),
            });
          }
        })
      }
      render={({ submitting, handleSubmit, pristine }) => (
        <form ref={ref} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Field
                name="business_name"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextField
                    {...input}
                    variant="outlined"
                    label={t('Business name')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} />
            <Grid item xs={6}>
              <Typography variant="subtitle1" gutterBottom>
                {t('Please upload the business logo (only .png files)')}
              </Typography>
              <Field
                name="business_logo"
                subscription={{ value: true }}
                render={({ input }) => (
                  <InputFile
                    {...input}
                    accept="image/png"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Gap />
          <Button
            type="submit"
            disabled={pristine || submitting}
            variant="contained"
          >
            {t('Save')}
          </Button>
        </form>
      )}
    />
  );
}
