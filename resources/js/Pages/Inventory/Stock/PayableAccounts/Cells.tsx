import { useTranslation } from 'react-i18next';
import { TableCell } from '@mui/material';
import ButtonStatus from '@/src/Components/ButtonStatus';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import CollapseButton from '@/src/lib/piwi/animated/CollapsibleRows/CollapseButton';
import { PayableAccount } from './hooks';

export default function Cells({
  active,
  onRequestCollapse,
  ...payableAccount
}: Cells) {
  const { t } = useTranslation();

  return (
    <>
      <TableCell>#{payableAccount.id}</TableCell>
      <TableCell>
        <CollapseButton
          active={active}
          variant="text"
          onClick={onRequestCollapse}
        >
          {payableAccount.description}
        </CollapseButton>
      </TableCell>
      <TableCell>
        <LabelDolarBs
          value={payableAccount.total_amount}
          variant="horizontal"
        />
      </TableCell>
      <TableCell>
        <LabelDolarBs value={payableAccount.amount_paid} variant="horizontal" />
      </TableCell>
      <TableCell>{payableAccount.created_at}</TableCell>
      <TableCell>
        {payableAccount.due_date
          ? payableAccount.due_date
          : t('Not applicable')}
      </TableCell>
      <TableCell>
        <ButtonStatus
          variant="text"
          size="small"
          status={payableAccount.status}
        />
      </TableCell>
    </>
  );
}

interface Cells extends PayableAccount {
  active: boolean;
  onRequestCollapse: () => void;
}
