import React, {
  useCallback,
  useState,
  useMemo,
  useContext as useSourceContext,
} from 'react';
import _ from 'lodash';
import { IconButton, ClickAwayListener, IconButtonProps } from '@mui/material';
import Popper from './Popper';

const IconButtonDropdownContext = React.createContext<() => void>(() => {});
export default function IconButtonDropdown({
  children,
  icon,
  ...props
}: IconButtonDropdownProps) {
  const popoverId = useMemo(() => _.uniqueId('popover-notification_'), []);
  const [noteAnchor, setNoteAnchor] = useState<HTMLElement | null>(null);

  const onClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setNoteAnchor(event.currentTarget);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setNoteAnchor(null);
  }, []);

  return (
    <IconButtonDropdownContext.Provider value={handlePopoverClose}>
      <IconButton
        {...props}
        aria-owns={noteAnchor !== null ? popoverId : undefined}
        aria-haspopup="true"
        onClick={onClick}
      >
        {icon}
      </IconButton>
      <Popper
        id={popoverId}
        open={noteAnchor !== null}
        anchorEl={noteAnchor}
        placement="bottom"
      >
        <ClickAwayListener onClickAway={handlePopoverClose}>
          <div>{children}</div>
        </ClickAwayListener>
      </Popper>
    </IconButtonDropdownContext.Provider>
  );
}

export function useDropdownContext() {
  const ctx = useSourceContext(IconButtonDropdownContext);

  return ctx;
}

export interface IconButtonDropdownProps
  extends Omit<IconButtonProps, 'aria-owns' | 'aria-haspopup' | 'children'> {
  children: React.ReactNode;
  icon: React.ReactNode;
}
