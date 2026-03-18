import { useCallback, useState } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper as MuiPaper,
  Typography,
} from '@mui/material';
import AppLayout from '@/src/Layouts/AppLayout';
import SearchProducts from '@/src/Components/SearchProducts';
import Gap from '@/src/lib/piwi/common/Gap';
import { type Product } from '../../types';
import Cart from './Cart';
import SelectProductsForm from './SelectProductsForm';
import DetailsForm from './DetailsForm';

export default function Stock() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, Product>
  >({});
  const [count, setCount] = useState(0);

  const searchSubmit = useCallback((p: Product[]) => {
    setProducts(p);
    setStep(1);
  }, []);

  return (
    <AppLayout>
      <Paper>
        <Cart
          selectedProducts={selectedProducts}
          count={count}
          onClickGo={() => setStep(2)}
        />
        <Stepper activeStep={step} orientation="vertical">
          <Step completed={step > 0}>
            <StepLabel>{t('Search product(s)')}</StepLabel>
            <StepContent>
              <Typography>
                {t('Find the product you want edit the available stock.')}
              </Typography>
              <Gap />
              <SearchProducts onSubmit={searchSubmit} />
            </StepContent>
          </Step>
          <Step completed={step > 1}>
            <StepLabel>{t('Select the product(s)')}</StepLabel>
            <StepContent>
              <Typography>
                {t('Select the product(s) you want make the adjustment')}.
              </Typography>
              <Gap />
              <SelectProductsForm
                products={products}
                onSubmit={(selected) => {
                  const newSelect = _.defaults(selectedProducts, selected);
                  setSelectedProducts(newSelect);
                  setCount(Object.keys(newSelect).length);
                }}
                onSearchMore={() => setStep(0)}
                onContinue={() => setStep(2)}
                onBack={() => setStep((prev) => prev - 1)}
              />
            </StepContent>
          </Step>
          <Step>
            <StepLabel>{t('Details')}</StepLabel>
            <StepContent>
              <Typography>
                {t(
                  'The info here supplied will be applied as a entry detail for the set of products selected',
                )}
                .
              </Typography>
              <Gap />
              {products.length && (
                <DetailsForm
                  products={selectedProducts}
                  onBack={() => setStep(0)}
                />
              )}
            </StepContent>
          </Step>
        </Stepper>
      </Paper>
    </AppLayout>
  );
}

const Paper = styled(MuiPaper)(({ theme }) => ({
  padding: theme.spacing(2),
  position: 'relative',
}));
