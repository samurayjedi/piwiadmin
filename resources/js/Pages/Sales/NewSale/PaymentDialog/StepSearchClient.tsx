import { useEffect, useRef } from 'react';
import { Field, FormSpy } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TextFieldMasked from '@/src/lib/piwi/core/TextFieldMasked';
import { useErrors } from '@/hooks';
import { useStepperContext } from './hooks';

export default function StepSearchClient() {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const ref = useRef<HTMLInputElement>(null);
  const { open, activeStep } = useStepperContext();

  useEffect(() => {
    if (open && activeStep === 0) {
      if (ref.current) {
        ref.current.focus();
      }
    }
  }, [open, activeStep]);

  return (
    <FormSpy
      subscription={{ submitting: true }}
      render={({ submitting }) => (
        <Field
          name="identification"
          subscription={{ value: true }}
          render={({ input }) => (
            <TextFieldMasked
              {...input}
              variant="standard"
              mask="$##########"
              definitions={{
                $: /[VEPJCGRvepjcgr]/,
                '#': /[0-9]/,
              }}
              label={t('Identification')}
              fullWidth
              color="secondary"
              inputRef={ref}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton type="submit">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={submitting}
              onChange={onChangeDecorator(input.onChange)}
              error={Boolean(fuckErrors[input.name])}
              helperText={fuckErrors[input.name]}
            />
          )}
        />
      )}
    />
  );
}
