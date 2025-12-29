import React, { useImperativeHandle } from 'react';
import { useFieldArray } from 'react-final-form-arrays';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-final-form';
import { TableRow, TableCell, Typography } from '@mui/material';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import { getPrice } from '../../hooks';
import CartItem from './CartItem';
import { FormCart } from '../types';

export default React.forwardRef<CartRef>((_, ref) => {
  const { t } = useTranslation();
  const form = useForm();
  const { fields } = useFieldArray('cart');
  const total = () => {
    let t2 = 0;
    fields.value?.forEach((c) => {
      t2 += parseFloat(c.sale_price) * parseFloat(c.qty);
    });

    return Math.round(t2 * 100) / 100;
  };

  useImperativeHandle(ref, () => ({
    add: (cart) => {
      const oldCart = fields.value;
      cart.forEach((nItem) => {
        const i =
          oldCart?.findIndex((oldItem) => oldItem.id === nItem.id) ?? -1;
        if (i >= 0) {
          form.change(
            `${fields.name}[${i}].qty`,
            Math.min(nItem.qty + parseFloat(oldCart[i].qty), nItem.stock),
          );
          form.change(
            `${fields.name}[${i}].sale_price`,
            parseFloat(getPrice(nItem).toFixed(2)),
          );
        } else {
          fields.push({
            ...nItem,
            sale_price: parseFloat(getPrice(nItem).toFixed(2)),
          });
        }
      });
    },
    total,
    data: () => form.getState().values,
  }));

  if (!fields.length) {
    return (
      <TableRow>
        <TableCell colSpan={7} align="center">
          {t("You haven't added any products")}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {fields.map((c, index) => {
        return (
          <CartItem
            key={`cart-row-${c}`}
            name={c}
            onRemove={() => fields.remove(index)}
          />
        );
      })}
      <TableRow>
        <TableCell colSpan={4} />
        <TableCell colSpan={2}>
          <Typography variant="h6" fontWeight="bold">
            {t('Total')}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <LabelDolarBs value={total()} />
        </TableCell>
      </TableRow>
    </>
  );
});

export interface CartRef {
  add: (cart: FormCart[]) => void;
  total: () => number;
  data: () => Record<string, any>;
}
