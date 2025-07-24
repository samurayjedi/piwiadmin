import { useRef, useEffect, useCallback } from 'react';
import {
  Grid,
  TextField,
  StepLabel,
  StepContent,
  Typography,
  Button,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { Field, FormSpy } from 'react-final-form';
import { useErrors } from '@/hooks';
import TextFieldMasked from '@/src/lib/piwi/core/TextFieldMasked';
import { useStepperContext } from './hooks';

export default function StepClientData() {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { open, activeStep, clientFound, setState } = useStepperContext();
  const [fuckErrors, onChangeDecorator] = useErrors();

  useEffect(() => {
    if (open && activeStep === 1) {
      if (!clientFound) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      }
    }
  }, [open, clientFound, activeStep]);

  const confirm = useCallback(() => {
    setState((prev) => ({ ...prev, activeStep: 2 }));
  }, [setState]);

  const back = useCallback(() => {
    setState({
      activeStep: 0,
      clientFound: -1,
    });
  }, [setState]);

  return (
    <>
      <StepLabel
        error={!clientFound}
        optional={
          !clientFound && (
            <Typography color="error">{fuckErrors.identification}</Typography>
          )
        }
      >
        {t('Client data')}
      </StepLabel>
      <StepContent>
        <FormSpy
          subscription={{ submitting: true }}
          render={({ submitting }) => (
            <Grid container rowSpacing={1}>
              <Grid item xs={12} md={6}>
                <Field
                  name="name"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextField
                      {...input}
                      inputRef={inputRef}
                      variant="standard"
                      label={t('Name')}
                      fullWidth
                      color="secondary"
                      disabled={submitting || Boolean(clientFound)}
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors[input.name])}
                      helperText={fuckErrors[input.name]}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  name="phone"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextFieldMasked
                      {...input}
                      variant="standard"
                      mask="&$##-#######"
                      definitions={{
                        '&': /[0]/,
                        $: /[24]/,
                        '#': /[0-9]/,
                      }}
                      label={t('Phone')}
                      fullWidth
                      color="secondary"
                      disabled={submitting || Boolean(clientFound)}
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors[input.name])}
                      helperText={fuckErrors[input.name]}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="address"
                  subscription={{ value: true }}
                  render={({ input }) => (
                    <TextField
                      {...input}
                      variant="standard"
                      label={t('Address')}
                      fullWidth
                      color="secondary"
                      multiline
                      rows={3}
                      disabled={submitting || Boolean(clientFound)}
                      onChange={onChangeDecorator(input.onChange)}
                      error={Boolean(fuckErrors[input.name])}
                      helperText={fuckErrors[input.name]}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} container justifyContent="flex-end">
                <Button variant="text" sx={{ mt: 2 }} onClick={back}>
                  {t('Back')}
                </Button>
                <Button
                  sx={{ mt: 2 }}
                  ref={buttonRef}
                  type={!clientFound ? 'submit' : 'button'}
                  variant="contained"
                  color={!clientFound ? 'primary' : 'success'}
                  endIcon={!clientFound ? <SaveIcon /> : <CheckIcon />}
                  onClick={clientFound ? confirm : undefined}
                >
                  {!clientFound ? t('Save') : t('Confirm')}
                </Button>
              </Grid>
            </Grid>
          )}
        />
      </StepContent>
    </>
  );
}
