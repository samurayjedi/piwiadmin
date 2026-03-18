import { FormEvent, useCallback, useState } from 'react';
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
import StockForm from './StockForm';
import SelectProductForm from './SelectProductForm';
import { useProduct } from './hooks';

export default function Stock() {
  const { t } = useTranslation();
  const pr = useProduct();
  const [step, setStep] = useState(pr ? 2 : 0);
  const [products, setProducts] = useState<Product[]>(pr ? [pr] : []);
  const [productId, setProductId] = useState(pr ? pr.id : 0);
  const currentProduct = (() => {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (product.id === productId) {
        return product;
      }
    }

    return null;
  })();

  const searchSubmit = useCallback((p: Product[]) => {
    setProducts(p);
    if (p.length > 1) {
      setStep(1);
    } else {
      setProductId(p[0].id);
      setStep(2);
    }
  }, []);

  const selectProductSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const selectedId = formData.get('product');
    if (selectedId) {
      setProductId(parseInt(selectedId as any, 10));
      setStep(2);
    }
  }, []);

  return (
    <AppLayout>
      <Paper>
        <Stepper activeStep={step} orientation="vertical">
          <Step>
            <StepLabel>{t('Search product')}</StepLabel>
            <StepContent>
              <Typography>
                {t('Find the product you want edit the available stock.')}
              </Typography>
              <Gap />
              <SearchProducts onSubmit={searchSubmit} />
            </StepContent>
          </Step>
          <Step>
            <StepLabel>{t('Select the product')}</StepLabel>
            <StepContent>
              <Typography>
                {t(
                  'Several results was found, select the one you want perform the stock adjustments.',
                )}
              </Typography>
              <Gap />
              <SelectProductForm
                products={products}
                onSubmit={selectProductSubmit}
                onBack={() => setStep((prev) => prev - 1)}
              />
            </StepContent>
          </Step>
          <Step>
            <StepLabel>{t('Make the adjustments')}</StepLabel>
            <StepContent>
              <Typography>
                {t(
                  'Add/Substract items from the stock of product_name as you need.',
                  {
                    product_name: currentProduct?.name,
                  },
                )}
              </Typography>
              <Gap />
              {productId !== 0 && currentProduct && (
                <StockForm
                  {...currentProduct}
                  onBack={() => setStep((prev) => prev - 1)}
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
}));
