import { useCallback, useState, useMemo, ChangeEvent, useRef } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  Paper as MUIPaper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import AppLayout from '@/src/Layouts/AppLayout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
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
  const [dialOpen, setDialOpen] = useState(false);
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

  const handleDialOpen = () => setDialOpen(true);
  const handleDialClose = () => setDialOpen(false);

  const handleSearchProductClose = useCallback(() => {
    setSearchProductOpen(false);
    handleDialOpen();
  }, []);

  const handleOnCashClose = useCallback(() => {
    setOnCashOpen(false);
    handleDialOpen();
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
        const btn = buttonRef.current.getElementsByTagName('button');

        // avoid access to undefined
        btn[0]?.focus();
      }
    }, 100);
  }, []);

  const handleSpinnerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const v = e.target.value;
      const newCart = [...cart];
      newCart[index].qty = parseFloat(v);

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
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 50 }} />
                  <TableCell sx={{ minWidth: 100 }}>{t('Barcode')}</TableCell>
                  <TableCell width="100%">{t('Name')}</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>{t('Price')}</TableCell>
                  <TableCell sx={{ minWidth: 220 }}>{t('Quantity')}</TableCell>
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
              </TableBody>
            </Table>
          </TableContainer>
        </form>
      </AppLayout>
      <SpeedDial
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        open={dialOpen}
        ariaLabel={t('Sale actions')}
        icon={<SpeedDialIcon icon={<ShoppingCartIcon />} />}
        hidden={searchProductOpen || onCashOpen}
        FabProps={{
          onClick: () => setDialOpen((prev) => !prev),
        }}
      >
        <SpeedDialAction
          icon={<AddShoppingCartIcon />}
          tooltipOpen
          tooltipTitle={t('Add')}
          onClick={() => {
            setSearchProductOpen(true);
            handleDialClose();
          }}
        />
        <SpeedDialAction
          ref={buttonRef}
          icon={<PaymentIcon />}
          tooltipOpen={Boolean(cart.length)}
          tooltipTitle={t('Payment')}
          onClick={() => {
            setOnCashOpen(true);
            handleDialClose();
          }}
          FabProps={{
            disabled: !cart.length,
          }}
        />
      </SpeedDial>
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
