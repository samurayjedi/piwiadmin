import { ChangeEvent, useCallback } from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Spinner from '@/src/lib/piwi/core/Spinner';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import { getPrice } from '../hooks';
import HiddenFields from './HiddenFields';
import { Cart } from '../types';

export default function CartRow({
  qty,
  index,
  onChange,
  onRemove,
  ...product
}: CartRowProps) {
  const { barcode, name, stock } = product;
  const price = getPrice({ ...product, qty });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e, index);
    },
    [onChange, index],
  );

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <TableRow>
      <TableCell>
        <IconButton onClick={handleRemove}>
          <RemoveShoppingCartIcon />
        </IconButton>
      </TableCell>
      <TableCell>{barcode}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        <LabelDolarBs value={price} />
      </TableCell>
      <TableCell>
        <HiddenFields {...product} />
        <Spinner
          name="qty[]"
          variant="standard"
          min={1}
          max={stock}
          value={qty}
          onChange={handleChange}
        />
      </TableCell>
      <TableCell align="right">
        <LabelDolarBs value={price * qty} />
      </TableCell>
    </TableRow>
  );
}

export interface CartRowProps extends Cart {
  index: number;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => void;
  onRemove: (i: number) => void;
}
