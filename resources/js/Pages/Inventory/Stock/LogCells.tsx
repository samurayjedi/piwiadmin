import { useTranslation } from 'react-i18next';
import { TableCell } from '@mui/material';
import CollapseButton from '@/src/lib/piwi/animated/CollapsibleRows/CollapseButton';
import { StockLog } from './hooks';

export default function LogCells({
  onRequestCollapse,
  active,
  ...log
}: LogCellsProps) {
  const { t } = useTranslation();

  return (
    <>
      <TableCell>{log.id}</TableCell>
      <TableCell>
        <CollapseButton
          active={active}
          variant="text"
          onClick={onRequestCollapse}
        >
          {log.description}
        </CollapseButton>
      </TableCell>
      <TableCell>{log.created_at}</TableCell>
      <TableCell>{t(log.adjustment_type)}</TableCell>
      <TableCell>{t(log.reason)}</TableCell>
    </>
  );
}

export interface LogCellsProps extends StockLog {
  active: boolean;
  onRequestCollapse: () => void;
}
