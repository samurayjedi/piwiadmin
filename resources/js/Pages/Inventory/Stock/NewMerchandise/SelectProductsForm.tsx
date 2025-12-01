import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormGroup,
  Checkbox,
  Button,
} from '@mui/material';
import Gap from '@/src/lib/piwi/common/Gap';
import Glue from '@/src/lib/piwi/common/Glue';
import { type Product } from '../../types';
import { getMeasurementSuffix } from '../../hooks';

export default function SelectProductForms({
  products,
  onSubmit,
  onBack,
  onSearchMore,
  onContinue,
}: SelectProductsFormProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement | undefined>();

  const atLeastOneChecked = () => {
    const els = document.getElementsByName(
      'products_ids[]',
    ) as NodeListOf<HTMLInputElement>;

    return Array.from(els).some((checkbox) => checkbox.checked);
  };

  useEffect(() => {
    if (ref.current !== undefined) {
      ref.current.focus();
    }
  }, []);

  return (
    <FormSelectProduct
      onSubmit={(e) => {
        e.preventDefault();
        const formEl = e.target as HTMLFormElement;
        const form = new FormData(formEl);
        const ids = form.getAll('products_ids[]');
        const selectedProducts: Record<string, Product> = {};
        ids.forEach((id) => {
          const selectedProductId = parseInt(id as string, 10);
          products.forEach((p) => {
            if (p.id === selectedProductId) {
              selectedProducts[id as string] = p;
            }
          });
        });
        onSubmit(selectedProducts);
      }}
    >
      <FormGroup>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>{t('ID')}</TableCell>
                <TableCell>{t('Barcode')}</TableCell>
                <TableCell>{t('Name')}</TableCell>
                <TableCell>{t('Stock')}</TableCell>
                <TableCell>{t('Category')}</TableCell>
                <TableCell>{t('Brand')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p, index) => (
                <TableRow key={`product-row-${p.id}`}>
                  <TableCell>
                    {index === 0 ? (
                      <Checkbox
                        name="products_ids[]"
                        inputRef={(inputRef) => {
                          if (inputRef) {
                            ref.current = inputRef;
                          }
                        }}
                        value={p.id}
                      />
                    ) : (
                      <Checkbox name="products_ids[]" value={p.id} />
                    )}
                  </TableCell>
                  <TableCell>#{p.id}</TableCell>
                  <TableCell>{p.barcode}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{`${p.stock} ${getMeasurementSuffix(p.measurement, p.stock)}`}</TableCell>
                  <TableCell>{p.category.category_label}</TableCell>
                  <TableCell>{p.brand.brand_label}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </FormGroup>
      <Gap />
      <StepActions>
        <Button variant="text" onClick={onBack}>
          {t('Back')}
        </Button>
        <Glue />
        <Button
          type="submit"
          color="primary"
          onClick={() => {
            if (atLeastOneChecked()) {
              onSearchMore();
            }
          }}
        >
          {t('Add and search more')}
        </Button>
        <Button
          type="submit"
          color="success"
          onClick={() => {
            if (atLeastOneChecked()) {
              onContinue();
            }
          }}
        >
          {t('Add and continue')}
        </Button>
      </StepActions>
    </FormSelectProduct>
  );
}

export interface SelectProductsFormProps {
  products: Product[];
  onSubmit: (products: Record<string, Product>) => void;
  onSearchMore: () => void;
  onContinue: () => void;
  onBack: () => void;
}

const FormSelectProduct = styled.form({
  display: 'flex',
  flexDirection: 'column',
});

const StepActions = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
});
