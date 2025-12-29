import React from 'react';
import { useFieldArray } from 'react-final-form-arrays';
import { useTranslation } from 'react-i18next';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  openSearchProductDialog,
  openPayDialog,
  closeDial,
  openDial,
  toggleDial,
} from '@/store/new_sale';

export default React.forwardRef<HTMLButtonElement>((_, ref) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const dialOpen = useAppSelector((state) => state.new_sale.dialOpen);
  const searchProductOpen = useAppSelector(
    (state) => state.new_sale.searchProductDialogOpen,
  );
  const payOpen = useAppSelector((state) => state.new_sale.payDialogOpen);
  const { fields } = useFieldArray('cart', { subscription: { value: true } });
  const hasItems = Boolean(fields.length);

  return (
    <SpeedDial
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      open={dialOpen}
      ariaLabel={t('Sale actions')}
      icon={<SpeedDialIcon icon={<ShoppingCartIcon />} />}
      hidden={searchProductOpen || payOpen}
      FabProps={{
        onClick: () => dispatch(toggleDial()),
      }}
    >
      <SpeedDialAction
        icon={<AddShoppingCartIcon />}
        tooltipOpen
        tooltipTitle={t('Add')}
        onClick={() => {
          dispatch(openSearchProductDialog());
          dispatch(openDial());
        }}
      />
      <SpeedDialAction
        ref={ref}
        icon={<PaymentIcon />}
        tooltipOpen={hasItems}
        tooltipTitle={t('Payment')}
        onClick={() => {
          dispatch(openPayDialog());
          dispatch(closeDial());
        }}
        FabProps={{
          disabled: !hasItems,
        }}
      />
    </SpeedDial>
  );
});
