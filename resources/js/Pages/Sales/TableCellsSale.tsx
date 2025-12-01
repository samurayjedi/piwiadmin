import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { TableCell, Button } from '@mui/material';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import ButtonStatus from '@/src/Components/ButtonStatus';
import CollapseButton from '@/src/lib/piwi/animated/CollapsibleRows/CollapseButton';
import { type SalesPageProps } from './types';
import UserInfo from './UserInfo';

export default function TableCellsSale({
  active,
  onRequestCollapse,
  ...sale
}: TableCellsSaleProps) {
  const { t } = useTranslation();

  return (
    <>
      <TableCell>
        <CollapseButton
          active={active}
          variant="text"
          color="primary"
          onClick={onRequestCollapse}
        >
          #{sale.id}
        </CollapseButton>
      </TableCell>
      <TableCell>{sale.created_at}</TableCell>
      <TableCell align="center">
        <Button
          LinkComponent={Link}
          href={route('sales.client', { client_id: sale.client.id })}
          variant="text"
          size="small"
          color="primary"
        >
          {sale.client.name}
        </Button>
      </TableCell>
      <TableCell>
        <UserInfo user={sale.user} />
      </TableCell>
      <TableCell>{t(sale.payment_type)}</TableCell>
      <TableCell>
        <LabelDolarBs value={sale.total_amount} />
      </TableCell>
      <TableCell>
        <LabelDolarBs
          value={Math.max(0, sale.total_amount - sale.amount_paid)}
        />
      </TableCell>
      <TableCell>
        <ButtonStatus variant="text" size="small" status={sale.status} />
      </TableCell>
    </>
  );
}

export interface TableCellsSaleProps extends SalesPageProps {
  active: boolean;
  onRequestCollapse: () => void;
}
