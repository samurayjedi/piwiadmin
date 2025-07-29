import _ from 'lodash';
import { useMemo, useState, useCallback } from 'react';
import { TableRow, TableRowProps, Typography } from '@mui/material';
import Popover from '@/src/lib/piwi/core/Popover';

export default function SaleTableRow(props: SaleTableRowProps) {
  const popoverId = useMemo(() => _.uniqueId('popover-sale-note_'), []);
  const [noteAnchor, setNoteAnchor] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const notes = event.currentTarget.getAttribute('data-notes');
      if (notes !== 'false') {
        setNoteAnchor(event.currentTarget);
      }
    },
    [],
  );

  const handlePopoverClose = useCallback(() => {
    setNoteAnchor(null);
  }, []);

  return (
    <>
      <TableRow
        {...props}
        aria-owns={noteAnchor !== null ? popoverId : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id={popoverId}
        open={noteAnchor !== null}
        anchorEl={noteAnchor}
        onClose={handlePopoverClose}
      >
        <Typography sx={{ p: 1 }} variant="subtitle1">
          {noteAnchor?.getAttribute('data-notes')}
        </Typography>
      </Popover>
    </>
  );
}

export type SaleTableRowProps = Omit<TableRowProps, ''>;
