import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '@/Pages/Inventory/Products';
import { TableCell, TableRow } from '@mui/material';
import Spinner from '@/src/lib/piwi/core/Spinner';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import HiddenFields from '../HiddenFields';

export default function ProductRow({
  onKeyDown,
  index,
  ...p
}: ProductRowProps) {
  const { t } = useTranslation();
  const { barcode, name, sale_price, stock } = p;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (index === 0) {
      if (ref.current) {
        ref.current.focus();
      }
    }
  }, [index]);

  return (
    <TableRow>
      <TableCell>{barcode}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        <LabelDolarBs value={parseInt(sale_price, 10)} />
      </TableCell>
      <TableCell>{stock}</TableCell>
      <TableCell>
        <HiddenFields {...p} />
        <Spinner
          inputRef={ref}
          name="qty[]"
          label={t('Quantity')}
          variant="standard"
          min={0}
          max={parseInt(stock, 10)}
          onKeyDown={onKeyDown}
        />
      </TableCell>
    </TableRow>
  );
}

export interface ProductRowProps extends Product {
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  index: number;
}
