import styled from '@emotion/styled';
import { css, Theme } from '@emotion/react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { Grid, InputAdornment, TextField, Button } from '@mui/material';
import { Form, Field, FormProps } from 'react-final-form';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import InventoryIcon from '@mui/icons-material/Inventory';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import PaymentsIcon from '@mui/icons-material/Payments';
import SaveIcon from '@mui/icons-material/Save';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import { useErrors } from '@/hooks';
import Select from '@/src/lib/piwi/core/Select';
import Options from '@/src/lib/piwi/core/Options';
import TextFieldMasked from '@/src/lib/piwi/core/TextFieldMasked';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import type { Category } from '../../Categories';
import type { Brand } from '../../Brands';
import { Product } from '../Products';
import ProfitField from './ProfitField';

export default function ProductForm({ id, onSubmit }: ProductFormProps) {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const page = usePage();
  const product = (_.get(page, 'props.products', []) as Product[]).find(
    (p) => p.id === id,
  );
  const categories = _.get(page, 'props.categories', []) as Category[];
  const brands = _.get(page, 'props.brands', []) as Brand[];

  return (
    <Form
      initialValues={
        !product
          ? {}
          : { ...product, wholesale: product.wholesale ? 'Yes' : 'No' }
      }
      subscription={{ submitting: true, pristine: true }}
      onSubmit={onSubmit}
      render={({ /** pristine, */ handleSubmit, submitting }) => (
        <HtmlForm onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
                          <LocalOfferIcon />
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
            <Grid item xs={6} md={3}>
              <Field
                name="sale_price"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextFieldDolarBs
                    {...input}
                    variant="standard"
                    label={t('Sale Price')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PointOfSaleIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <ProfitField />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field
                name="tax"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextFieldDolarBs
                    {...input}
                    variant="standard"
                    label={t('Tax')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AssuredWorkloadIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <Field
                name="stock"
                subscription={{ value: true }}
                render={({ input }) => (
                  <TextFieldMasked
                    {...input}
                    mask="##########"
                    definitions={{
                      '#': /[0-9]/,
                    }}
                    variant="standard"
                    label={t('Stock')}
                    fullWidth
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <InventoryIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={8} md={5}>
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
            <Grid item xs={12}>
              <Field
                name="wholesale"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Options
                        {...input}
                        css={radios}
                        type="radio"
                        label={t('The product is wholesale selling?')}
                        color="secondary"
                        options={['Yes', 'No']}
                        disabled={submitting}
                        onChange={onChangeDecorator(input.onChange)}
                        error={Boolean(fuckErrors[input.name])}
                        helperText={fuckErrors[input.name]}
                      />
                    </Grid>
                    {input.value === 'Yes' && (
                      <>
                        <Grid item xs={12} md={4}>
                          <Field
                            name="wholesale_qty"
                            subscription={{ value: true }}
                            render={(pollito) => (
                              <TextFieldMasked
                                {...pollito.input}
                                mask="##########"
                                definitions={{
                                  '#': /[0-9]/,
                                }}
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
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <DynamicFeedIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Field
                            name="wholesale_price"
                            subscription={{ value: true }}
                            render={(pollito) => (
                              <TextFieldDolarBs
                                {...pollito.input}
                                variant="standard"
                                label={t('Wholesale Price')}
                                fullWidth
                                color="secondary"
                                disabled={submitting}
                                onChange={onChangeDecorator(
                                  pollito.input.onChange,
                                )}
                                error={Boolean(fuckErrors[pollito.input.name])}
                                helperText={fuckErrors[pollito.input.name]}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <PaymentsIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                )}
              />
            </Grid>
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
