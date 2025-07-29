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
      const v = parseInt(e.target.value, 10);
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
      <TableCell>{stock}</TableCell>
      <TableCell>
        <HiddenFields {...p} />
        <Spinner
          inputRef={ref}
          name="qty[]"
          label={t('Quantity')}
          variant="standard"
          min={0}
          max={stock}
          value={qty}
          onKeyDown={onKeyDown}
          onChange={handleSpinnerChange}
        />
      </TableCell>
    </TableRow>
  );
}

export interface ProductRowProps extends Product {
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  index: number;
}
