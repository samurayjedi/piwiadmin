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
} from '@mui/material';
import { Form, Field, FormProps } from 'react-final-form';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import SaveIcon from '@mui/icons-material/Save';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { useErrors } from '@/hooks';
import Select from '@/src/lib/piwi/core/Select';
import TextFieldMasked from '@/src/lib/piwi/core/TextFieldMasked';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import TextFieldCurrency from '@/src/lib/piwi/core/TextFieldCurrency';
import Spinner from '@/src/lib/piwi/core/Spinner';
import { useCategories } from '@/Pages/Categories/hooks';
import { useBrands } from '@/Pages/Brands/hooks';
import { useProducts } from '../hooks';
import SalePriceTextfield from './SalePriceTextField';
import WholesalePriceTextfield from './WholesalePriceTextField';

export default function ProductForm({ id, onSubmit }: ProductFormProps) {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const products = useProducts();
  const product = products.find((p) => p.id === id);
  const categories = useCategories();
  const brands = useBrands();

  return (
    <Form
      initialValues={
        !product
          ? {}
          : _.mapValues(product, (v, k) => (k !== 'wholesale' ? String(v) : v))
      }
      subscription={{ submitting: true, pristine: true }}
      onSubmit={onSubmit}
      render={({ /** pristine, */ handleSubmit, submitting }) => (
        <HtmlForm onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Field
                name="barcode"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextFieldMasked
                    {...input}
                    sx={{ pb: 1 }}
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
                  <TextFieldCurrency
                    {...input}
                    variant="standard"
                    label={t('Profit')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    thousandSeparator={false}
                    prefix=""
                    suffix="%"
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
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SalePriceTextfield />
            </Grid>
            <Grid item xs={12} md={3}>
              <Field
                name="stock"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Spinner
                    {...input}
                    min={0}
                    variant="standard"
                    label={t('Stock')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={5}>
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
            <Grid item xs={12} md={5}>
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
            <Field
              name="wholesale"
              subscription={{ value: true }}
              render={({ input }) => (
                <>
                  <Grid item xs={12} md={2}>
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
                  </Grid>
                  {input.value && (
                    <>
                      <Grid item xs={12} md={4}>
                        <Field
                          name="wholesale_qty"
                          subscription={{ value: true }}
                          render={(pollito) => (
                            <Spinner
                              {...pollito.input}
                              min={0}
                              variant="standard"
                              label={t('Wholesale Count')}
                              fullWidth
                              color="secondary"
                              disabled={submitting}
                              onChange={onChangeDecorator(
                                pollito.input.onChange,
                              )}
                              error={Boolean(fuckErrors[pollito.input.name])}
                              helperText={fuckErrors[pollito.input.name]}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Field
                          name="wholesale_profit"
                          subscription={{ value: true }}
                          render={(pollito) => (
                            <TextFieldCurrency
                              {...pollito.input}
                              variant="standard"
                              label={t('Wholesale Profit')}
                              fullWidth
                              color="secondary"
                              disabled={submitting}
                              thousandSeparator={false}
                              prefix=""
                              suffix="%"
                              onChange={onChangeDecorator(
                                pollito.input.onChange,
                              )}
                              error={Boolean(fuckErrors[pollito.input.name])}
                              helperText={fuckErrors[pollito.input.name]}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PercentIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <WholesalePriceTextfield />
                      </Grid>
                    </>
                  )}
                </>
              )}
            />
          </Grid>
          <Button
            sx={{ mt: 2, alignSelf: 'flex-end' }}
            type="submit"
            variant="contained"
            color="secondary"
            startIcon={<SaveIcon />}
            disabled={submitting}
          >
            {t('Save')}
          </Button>
        </HtmlForm>
      )}
    />
  );
}

export interface ProductFormProps {
  id?: number;
  onSubmit: FormProps['onSubmit'];
}

const HtmlForm = styled.form({
  display: 'flex',
  flexDirection: 'column',
});

export const radios = (theme: Theme) =>
  css({
    flexDirection: 'row',
    paddingTop: theme.spacing(1),
  });
