import { useEffect, useRef } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { css, Theme } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  InputAdornment,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Form, Field, FormProps } from 'react-final-form';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import SaveIcon from '@mui/icons-material/Save';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { measurements } from '@/consts';
import { useErrors } from '@/hooks';
import Select from '@/src/lib/piwi/core/Select';
import TextFieldMasked from '@/src/lib/piwi/core/TextFieldMasked';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import TextFieldNumericFormat from '@/src/lib/piwi/core/TextFieldNumericFormat';
import { useCategories } from '@/Pages/Categories/hooks';
import { useBrands } from '@/Pages/Brands/hooks';
import HtmlForm from '@/src/Components/HtmlForm';
import { useAppSelector } from '@/store/hooks';
import { useProducts } from '../hooks';
import SalePriceTextfield from './SalePriceTextField';
import WholesalePriceTextfield from './WholesalePriceTextField';
import StockField from './StockField';
import WholesaleQtyField from './WholesaleQtyField';
import WholesaleProfitField from './WholesaleProfitField';
import NotificationStockField from './NotificationStockField';

export default function ProductForm({ id, onSubmit }: ProductFormProps) {
  const { t } = useTranslation();
  const sync = useAppSelector((state) => state.app.sync);
  const [fuckErrors, onChangeDecorator] = useErrors();
  const products = useProducts();
  const product = products.find((p) => p.id === id);
  const categories = useCategories();
  const brands = useBrands();
  const firstField = useRef<HTMLInputElement>(null);
  let initialValues: any = !product
    ? {}
    : _.mapValues(product, (v: any, k) => {
        switch (k) {
          case 'category':
            return v.category_slug;
          case 'brand':
            return v.brand_slug;
          default:
            return v;
        }
      });
  initialValues = _.pickBy(initialValues, (v) => v !== null);

  useEffect(() => {
    if (firstField.current) {
      firstField.current.focus();
    }
  }, []);

  return (
    <Form
      initialValues={{
        notification: Boolean(product?.notification_stock),
        notification_stock: 0,
        stock: 0,
        wholesale_qty: 0,
        ...initialValues,
      }}
      subscription={{ submitting: true, pristine: true }}
      onSubmit={onSubmit}
      render={({ /** pristine, */ handleSubmit, submitting }) => (
        <StyledHtmlForm onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Field
                name="barcode"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextFieldMasked
                    {...input}
                    sx={{ pb: 1 }}
                    inputRef={firstField}
                    variant="standard"
                    mask="##########"
                    definitions={{
                      '#': /[0-9]/,
                    }}
                    label={t('Barcode')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <QrCode2Icon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Field
                name="name"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextField
                    {...input}
                    variant="standard"
                    label={t('Product Name')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DriveFileRenameOutlineIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Field
                name="price"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextFieldDolarBs
                    {...input}
                    variant="standard"
                    label={t('Price')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Field
                name="profit"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextFieldNumericFormat
                    {...input}
                    variant="standard"
                    label={t('Profit')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon />
                        </InputAdornment>
                      ),
                    }}
                    numericFormatProps={{
                      thousandSeparator: false,
                      suffix: '%',
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SalePriceTextfield />
            </Grid>
            <Grid item xs={12} md={3}>
              <Field
                name="measurement"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Select
                    {...input}
                    sx={{ width: '100%' }}
                    label={t('Measurement')}
                    items={Object.fromEntries(
                      measurements.map((m) => [m, t(m)]),
                    )}
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
            <Grid item xs={12} md={3}>
              <StockField />
            </Grid>
            <Grid item xs={12} md={3}>
              <Field
                name="category"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Select
                    {...input}
                    sx={{ width: '100%' }}
                    label={t('Product Category')}
                    items={Object.fromEntries(
                      categories.map(({ category_label, category_slug }) => [
                        category_slug,
                        category_label,
                      ]),
                    )}
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
            <Grid item xs={12} md={4}>
              <Field
                name="brand"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Select
                    {...input}
                    sx={{ width: '100%' }}
                    label={t('Product Brand')}
                    items={Object.fromEntries(
                      brands.map(({ brand_label, brand_slug }) => [
                        brand_slug,
                        brand_label,
                      ]),
                    )}
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
            <Grid item xs={12} md={2}>
              <Field
                name="wholesale"
                subscription={{ value: true }}
                render={({ input }) => (
                  <FormControlLabel
                    sx={{
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      alignItems: 'flex-start',
                      ml: 1,
                    }}
                    control={
                      <Switch
                        {...input}
                        checked={Boolean(input.value)}
                        color="secondary"
                        disabled={submitting}
                        onChange={(ev, checked) => input.onChange(checked)}
                      />
                    }
                    label={t('Wholesale selling?')}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <WholesaleQtyField />
            </Grid>
            <Grid item xs={12} md={4}>
              <WholesaleProfitField />
            </Grid>
            <Grid item xs={12} md={4}>
              <WholesalePriceTextfield />
            </Grid>
          </Grid>
          <FormFooter>
            <Field
              name="notification"
              subscription={{ value: true }}
              render={({ input }) => (
                <FormControlLabel
                  sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                  }}
                  name={input.name}
                  label={t('Notify when')}
                  control={
                    <Checkbox
                      checked={input.value}
                      onChange={input.onChange}
                      color="secondary"
                    />
                  }
                  disabled={submitting}
                />
              )}
            />
            <NotificationStockField />
            <Button
              sx={{ mt: 2, alignSelf: 'flex-end' }}
              type="submit"
              variant="contained"
              color="secondary"
              startIcon={<SaveIcon />}
              disabled={sync !== 'ok' || submitting}
            >
              {t('Save')}
            </Button>
          </FormFooter>
        </StyledHtmlForm>
      )}
    />
  );
}

export interface ProductFormProps {
  id?: number;
  onSubmit: FormProps['onSubmit'];
}

const StyledHtmlForm = styled(HtmlForm)({
  display: 'flex',
  flexDirection: 'column',
});

const FormFooter = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
});

export const radios = (theme: Theme) =>
  css({
    flexDirection: 'row',
    paddingTop: theme.spacing(1),
  });
