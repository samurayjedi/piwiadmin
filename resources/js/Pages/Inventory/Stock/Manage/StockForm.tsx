import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { Grid, TextField, Button } from '@mui/material';
import { useErrors } from '@/hooks';
import TextFieldNumericFormat from '@/src/lib/piwi/core/TextFieldNumericFormat';
import Select from '@/src/lib/piwi/core/Select';
import Spinner from '@/src/lib/piwi/core/Spinner';
import { type Product } from '../../types';
import {
  measurementNumericFormatProps,
  getMeasurementSuffix,
} from '../../hooks';
import ReasonField from './ReasonField';

export default function StockForm({ onBack, ...product }: StockFormProps) {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const firstFieldRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  return (
    <Form
      initialValues={{ adjustment: 0 }}
      subscription={{ submitting: true, pristine: true }}
      onSubmit={(data) =>
        new Promise<void>((resolve) => {
          router.post(
            route('stock.manage.edit'),
            { ...data, product_id: product.id },
            {
              onFinish: () => {
                resolve();
              },
            },
          );
        })
      }
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Grid container columnSpacing={1} rowGap={2}>
            <Grid item xs={12} md={6}>
              <Field
                name="adjustment_type"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Select
                    {...input}
                    inputRef={firstFieldRef}
                    label={t('Adjustment Type')}
                    items={{
                      addition: t('Addition'),
                      subtraction: t('Substraction'),
                    }}
                    fullWidth
                    variant="standard"
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextFieldNumericFormat
                label={t('Current stock')}
                value={product.stock}
                variant="standard"
                color="secondary"
                disabled
                numericFormatProps={{
                  thousandSeparator: false,
                  suffix: ` ${getMeasurementSuffix(
                    product.measurement,
                    product.stock,
                  )}`,
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Field
                name="adjustment"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Spinner
                    {...input}
                    min={0}
                    variant="standard"
                    label={t('Adjustment')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                    numericFormatProps={measurementNumericFormatProps(
                      product.measurement,
                      parseFloat(input.value),
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ReasonField />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                name="note"
                subscription={{ value: true }}
                render={(pollito) => (
                  <TextField
                    {...pollito.input}
                    variant="standard"
                    label={t('Note')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(pollito.input.onChange)}
                    error={Boolean(fuckErrors[pollito.input.name])}
                    helperText={fuckErrors[pollito.input.name]}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
              <Button variant="text" onClick={onBack}>
                {t('Back')}
              </Button>
              <Button variant="contained" type="submit">
                {t('Finish')}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
}

export interface StockFormProps extends Product {
  onBack: () => void;
}
