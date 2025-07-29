import { useCallback, useState, useMemo, ChangeEvent, useRef } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper as MUIPaper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import AppLayout from '@/src/Layouts/AppLayout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import CartRow from './CartRow';
import SearchProductDialog from './SearchProductDialog';
import { CartContext } from './hooks';
import { getPrice } from '../hooks';
import PaymentDialog from './PaymentDialog';
import { Cart } from '../types';

export default function NewSale() {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [searchProductOpen, setSearchProductOpen] = useState(true);
  const [onCashOpen, setOnCashOpen] = useState(false);
  const [cart, setCart] = useState<Cart[]>([]);
  const total = useMemo(() => {
    let t2 = 0;
    cart.forEach((c) => {
      t2 += getPrice(c) * c.qty;
    });

    return Math.round(t2 * 100) / 100;
  }, [cart]);

  const handleSearchProductClose = useCallback(() => {
    setSearchProductOpen(false);
  }, []);

  const handleOnCashClose = useCallback(() => {
    setOnCashOpen(false);
  }, []);

  const handleDialogAddAction = useCallback((newCart: Cart[]) => {
    setCart((prevCart) => {
      const mergedCart = [...prevCart];
      const hasId = (id: number) => {
        for (let i = 0; i < mergedCart.length; i++) {
          if (mergedCart[i].id === id) {
            return i;
          }
        }

        return -1;
      };
      /** */
      for (let i = 0; i < newCart.length; i++) {
        const index = hasId(newCart[i].id);
        if (index < 0) {
          mergedCart.push(newCart[i]);
        } else {
          mergedCart[index].qty = Math.min(
            mergedCart[index].qty + newCart[i].qty,
            mergedCart[index].stock,
          );
        }
      }

      return mergedCart;
    });

    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    }, 100);
  }, []);

  const handleSpinnerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const v = e.target.value;
      const newCart = [...cart];
      newCart[index].qty = parseInt(v, 10);

      setCart(newCart);
    },
    [cart],
  );

  const handleRemove = useCallback(
    (i: number) => {
      setCart(cart.filter((v, index) => index !== i));
    },
    [cart],
  );

  return (
    <CartContext.Provider value={formRef}>
      <AppLayout>
        <Container maxWidth="lg">
          <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 50 }} />
                    <TableCell sx={{ minWidth: 100 }}>{t('Barcode')}</TableCell>
                    <TableCell width="100%">{t('Name')}</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>{t('Price')}</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>
                      {t('Quantity')}
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 100 }}>
                      {t('Subtotal')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.length > 0 ? (
                    <>
                      {cart.map((c, index) => {
                        return (
                          <CartRow
                            {...c}
                            key={`cart-row-${c.id}`}
                            index={index}
                            onChange={handleSpinnerChange}
                            onRemove={handleRemove}
                          />
                        );
                      })}
                      <TableRow>
                        <TableCell colSpan={3} />
                        <TableCell colSpan={2}>
                          <Typography variant="h6" fontWeight="bold">
                            {t('Total')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <LabelDolarBs value={total} />
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {t("You haven't added any products")}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={6}>
                      <BtnsContainer>
                        <IconButton onClick={() => setSearchProductOpen(true)}>
                          <AddShoppingCartIcon />
                        </IconButton>
                        <FormGap />
                        <FormButton
                          ref={buttonRef}
                          startIcon={<DoneAllIcon />}
                          variant="contained"
                          color="primary"
                          onClick={() => setOnCashOpen(true)}
                          disabled={!cart.length}
                        >
                          {t('Proceed')}
                        </FormButton>
                      </BtnsContainer>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </form>
        </Container>
      </AppLayout>
      <SearchProductDialog
        open={searchProductOpen}
        onClose={handleSearchProductClose}
        addAction={handleDialogAddAction}
      />
      <PaymentDialog
        open={onCashOpen}
        amount={total}
        onClose={handleOnCashClose}
      />
    </CartContext.Provider>
  );
}

const Paper = styled(MUIPaper)({
  display: 'flex',
  flexDirection: 'column',
  // padding: theme.spacing(1),
});

const BtnsContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
  },
  flexWrap: 'wrap',
}));

const FormButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  '&:last-child': {
    marginRight: 0,
  },
  marginTop: theme.spacing(1),
}));

const FormGap = styled.span(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'block',
    flex: 1,
  },
}));
