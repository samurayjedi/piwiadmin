import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  ChangeEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell, TableRow } from '@mui/material';
import Spinner from '@/src/lib/piwi/core/Spinner';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import {
  measurementNumericFormatProps,
  getMeasurementSuffix,
} from '@/Pages/Inventory/hooks';
import HiddenFields from '../HiddenFields';
import { getPrice } from '../../hooks';

export default function ProductRow({
  onKeyDown,
  index,
  ...p
}: ProductRowProps) {
  const { t } = useTranslation();
  const [qty, setQty] = useState(0);
  const { barcode, name, stock } = p;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (index === 0) {
      if (ref.current) {
        ref.current.focus();
      }
    }
  }, [index]);

  const handleSpinnerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = parseFloat(e.target.value);
      setQty(Math.max(0, Math.min(stock, v)));
    },
    [stock],
  );

  return (
    <TableRow>
      <TableCell>{barcode}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        <LabelDolarBs value={getPrice({ ...p, qty })} />
      </TableCell>
      <TableCell>
        {stock}
        &nbsp;
        {getMeasurementSuffix(p.measurement, p.stock)}
      </TableCell>
      <TableCell>
        <HiddenFields {...p} />
        <input type="hidden" name="qty[]" value={qty} />
        <Spinner
          inputRef={ref}
          label={t('Quantity')}
          variant="standard"
          min={0}
          max={stock}
          value={qty}
          onKeyDown={onKeyDown}
          onChange={handleSpinnerChange}
          numericFormatProps={measurementNumericFormatProps(p.measurement, qty)}
        />
      </TableCell>
    </TableRow>
  );
}

export interface ProductRowProps extends Product {
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  index: number;
}
