import { FormEvent, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  RadioGroup,
  Radio,
  Button,
} from '@mui/material';
import Gap from '@/src/lib/piwi/common/Gap';
import { type Product } from '../../types';
import { getMeasurementSuffix } from '../../hooks';

export default function SelectProductForm({
  products,
  onSubmit,
  onBack,
}: SelectProductFormProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.focus();
    }
  }, []);

  return (
    <FormSelectProduct onSubmit={onSubmit}>
      <RadioGroup name="product">
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
                      <Radio inputRef={ref} value={p.id} />
                    ) : (
                      <Radio value={p.id} />
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
      </RadioGroup>
      <Gap />
      <StepActions>
        <Button variant="text" onClick={onBack}>
          {t('Back')}
        </Button>
        <Button variant="contained" type="submit">
          {t('Next')}
        </Button>
      </StepActions>
    </FormSelectProduct>
  );
}

export interface SelectProductFormProps {
  products: Product[];
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
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
