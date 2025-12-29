import { useCallback, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import {
  Paper as MUIPaper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import AppLayout from '@/src/Layouts/AppLayout';
import { useAppDispatch } from '@/store/hooks';
import {
  closeSearchProductDialog,
  closePayDialog,
  openDial,
  openSearchProductDialog,
} from '@/store/new_sale';
import Dial from './Dial';
import Cart, { CartRef } from './Cart';
import SearchProductDialog from './SearchProductDialog';

import PaymentDialog from './PaymentDialog';
import { useImportedCart } from './hooks';

export default function NewSale() {
  const { t } = useTranslation();
  const { cart, recreated_sale } = useImportedCart();
  const dispatch = useAppDispatch();
  const btnPayRef = useRef<HTMLButtonElement>(null);
  const cartRef = useRef<CartRef>(null);

  const handleSearchProductClose = useCallback(() => {
    dispatch(closeSearchProductDialog());
    dispatch(openDial());
  }, []);

  const handleOnCashClose = useCallback(() => {
    dispatch(closePayDialog());
    dispatch(openDial());
  }, []);

  /** reset states when first open the page */

  useEffect(() => {
    if (!recreated_sale) {
      dispatch(openSearchProductDialog());
    } else {
      dispatch(closeSearchProductDialog());
    }
    dispatch(closePayDialog());
  }, []);

  return (
    <>
      <Form
        mutators={{
          ...arrayMutators,
        }}
        initialValues={{ cart }}
        subscription={{ submitting: true, pristine: true }}
        onSubmit={() => console.log('I love lemuel!!!!')}
        render={({ handleSubmit }) => (
          <AppLayout>
            <form id="new-sale-cart-form" onSubmit={handleSubmit}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 50 }} />
                      <TableCell sx={{ minWidth: 100 }}>
                        {t('Barcode')}
                      </TableCell>
                      <TableCell width="100%">{t('Name')}</TableCell>
                      <TableCell sx={{ minWidth: 200 }}>
                        {t('Quantity')}
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        {t('Wholesale')}
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>{t('Price')}</TableCell>
                      <TableCell align="right" sx={{ minWidth: 100 }}>
                        {t('Subtotal')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <FieldArray
                      name="cart"
                      subscription={{ value: true }}
                      render={() => (
                        <>
                          <Cart ref={cartRef} />
                          <Dial ref={btnPayRef} />
                        </>
                      )}
                    />
                  </TableBody>
                </Table>
              </TableContainer>
            </form>
          </AppLayout>
        )}
      />
      <SearchProductDialog
        onClose={handleSearchProductClose}
        onAdd={(newCart) => {
          cartRef.current?.add(newCart);
          // focus to pay button
          setTimeout(() => {
            if (btnPayRef.current) {
              const btn = btnPayRef.current.getElementsByTagName('button');

              // avoid access to undefined
              btn[0]?.focus();
            }
          }, 100);
        }}
      />
      <PaymentDialog cartRef={cartRef} onClose={handleOnCashClose} />
    </>
  );
}

const Paper = styled(MUIPaper)({
  display: 'flex',
  flexDirection: 'column',
  // padding: theme.spacing(1),
});
