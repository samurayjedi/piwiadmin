import { useEffect, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import { router } from '@inertiajs/react';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { useTranslation } from 'react-i18next';
import {
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useErrors } from '@/hooks';
import Select from '@/src/lib/piwi/core/Select';
import TextFieldNumericFormat from '@/src/lib/piwi/core/TextFieldNumericFormat';
import Spinner from '@/src/lib/piwi/core/Spinner';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import {
  getMeasurementSuffix,
  measurementNumericFormatProps,
} from '@/Pages/Inventory/hooks';
import { convertBracketToDot } from '@/src/lib/miscUtils';
import Glue from '@/src/lib/piwi/common/Glue';
import { Product as ProductType } from '@/Pages/Inventory/types';
import PayField from './PayField';
import PayNoteField from './PayNoteField';
import DueDateField from './DueDateField';
import NotificationIntervalField from './NotificationIntervalField';
import InitialField from './InitialField';
import UnitPrice from './UnitPrice';

export default function DetailsForm({ products, onBack }: DetailsFormProps) {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const firstFieldRef = useRef<HTMLSelectElement>(null);
  const count = Object.keys(products).length;
  const initialValues = useMemo(
    () => ({
      payment_type: 'cash',
      products_entries: _.map(products, (product) => ({
        ...product,
        adjustment: 0,
      })),
      update_prices: true,
    }),
    [count],
  );

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  return (
    <Form
      mutators={{
        ...arrayMutators,
      }}
      initialValues={initialValues}
      subscription={{ submitting: true, pristine: true }}
      onSubmit={(data) =>
        new Promise<void>((resolve) => {
          router.post(
            route('stock.new_merchandise.save'),
            { ...data },
            {
              onFinish: () => {
                resolve();
              },
              onSuccess: () => router.visit(route('stock')),
            },
          );
        })
      }
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <DetailsFormGrid>
            <Field
              name="provider"
              subscription={{ value: true }}
              render={({ input }) => (
                <TextField
                  {...input}
                  variant="standard"
                  label={t('Provider')}
                  fullWidth
                  color="secondary"
                  disabled={submitting}
                  onChange={onChangeDecorator(input.onChange)}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                />
              )}
            />
            <Field
              name="total_amount"
              subscription={{ value: true }}
              render={({ input }) => (
                <TextFieldDolarBs
                  {...input}
                  label={t('Total amount')}
                  variant="standard"
                  fullWidth
                  color="secondary"
                  disabled={submitting}
                  onChange={onChangeDecorator(input.onChange)}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                />
              )}
            />
            <PaymentTypeInitialContainer>
              <Field
                name="payment_type"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Select
                    {...input}
                    inputRef={firstFieldRef}
                    label={t('Payment type')}
                    items={{
                      cash: t('Cash'),
                      credit: t('Credit'),
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
              <InitialField />
            </PaymentTypeInitialContainer>
            <PayField />
            <PayNoteField />
            <DueDateField />
            <NotificationIntervalField />
            <ProductsLabel variant="body1" fontWeight="bold">
              {t('List of products in the invoice')}.
            </ProductsLabel>
            <FieldArray
              name="products_entries"
              render={({ fields }) =>
                fields.map((name, i) => (
                  <Product key={name}>
                    <ProductDetails>
                      <Field
                        name={`${name}.id`}
                        subscription={{ value: true }}
                        render={({ input }) => (
                          <input
                            type="hidden"
                            name={input.name}
                            value={input.value}
                          />
                        )}
                      />
                      <Typography variant="body1">
                        {initialValues.products_entries[i].name}
                      </Typography>
                      <TextFieldNumericFormat
                        label={t('Current stock')}
                        value={initialValues.products_entries[i].stock}
                        variant="standard"
                        color="secondary"
                        disabled
                        numericFormatProps={{
                          thousandSeparator: false,
                          suffix: ` ${getMeasurementSuffix(initialValues.products_entries[i].measurement, initialValues.products_entries[i].stock)}`,
                        }}
                      />
                    </ProductDetails>
                    <UnitPrice name={name} />
                    <Field
                      name={`${name}.adjustment`}
                      subscription={{ value: true }}
                      render={({ input }) => (
                        <Spinner
                          {...input}
                          min={0}
                          variant="standard"
                          label={t('Adjustment')}
                          color="secondary"
                          disabled={submitting}
                          onChange={onChangeDecorator(input.onChange)}
                          error={Boolean(
                            _.get(fuckErrors, convertBracketToDot(input.name)),
                          )}
                          helperText={_.get(
                            fuckErrors,
                            convertBracketToDot(input.name),
                          )}
                          numericFormatProps={measurementNumericFormatProps(
                            initialValues.products_entries[i].measurement,
                            parseFloat(input.value),
                          )}
                        />
                      )}
                    />
                  </Product>
                ))
              }
            />
            <Field
              name="note"
              subscription={{ value: true }}
              render={({ input }) => (
                <TextFieldNote
                  {...input}
                  variant="standard"
                  label={t('Note')}
                  fullWidth
                  color="secondary"
                  disabled={submitting}
                  onChange={onChangeDecorator(input.onChange)}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                  multiline
                  rows={2}
                />
              )}
            />
            <Actions>
              <Button variant="text" disabled={submitting} onClick={onBack}>
                {t('Back')}
              </Button>
              <Glue />
              <Field
                name="update_prices"
                subscription={{ value: true }}
                render={({ input }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...input}
                        checked={input.value}
                        disabled={submitting}
                        color="warning"
                      />
                    }
                    label={t('Update prices')}
                  />
                )}
              />

              <Button variant="contained" type="submit" disabled={submitting}>
                {t('Finish')}
              </Button>
            </Actions>
          </DetailsFormGrid>
        </form>
      )}
    />
  );
}

export interface DetailsFormProps {
  products: Record<string, ProductType>;
  onBack: () => void;
}

const DetailsFormGrid = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
  gridTemplateRows: 'auto',
  gap: theme.spacing(1),
}));

const PaymentTypeInitialContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
});

const ProductsLabel = styled(Typography)(({ theme }) => ({
  gridColumn: 'span 1',
  [theme.breakpoints.up('md')]: {
    gridColumn: '1 / -1',
  },
}));

const Product = styled.div(({ theme }) => ({
  gridColumn: 'span 1',
  [theme.breakpoints.up('md')]: {
    gridColumn: '1 / -1',
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexFlow: 'row wrap',
}));

const ProductDetails = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const TextFieldNote = styled(TextField)(({ theme }) => ({
  gridColumn: 'span 1',
  [theme.breakpoints.up('md')]: {
    gridColumn: '1 / -1',
  },
}));

const Actions = styled.div(({ theme }) => ({
  gridColumn: 'span 1',
  [theme.breakpoints.up('md')]: {
    gridColumn: '1 / -1',
  },
  display: 'flex',
  marginTop: theme.spacing(2),
}));
