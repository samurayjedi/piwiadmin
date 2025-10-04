import { useState, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { Link } from '@inertiajs/react';
import {
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import Popper from '@/src/lib/piwi/core/Popper';
import type { NavItem } from '.';

export default function NavPopper({ anchorId, items }: NavPopperProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    setAnchor(null);
  }, []);

  useEffect(() => {
    if (anchorId) {
      const el = document.getElementById(anchorId);
      if (el) {
        setAnchor(el);
        return;
      }
    }

    setAnchor(null);
  }, [anchorId]);

  return (
    <Popper
      sx={{ mt: '2px !important' }}
      open={anchor !== null}
      anchorEl={anchor}
      placement="bottom"
    >
      <ClickAwayListener onClickAway={handleClose}>
        <NavItems>
          <List>
            {items.map((item) => (
              <ListItemButton
                sx={{ pr: 5, pl: 5 }}
                key={item.key}
                {...(item.link ? { LinkComponent: Link, href: item.link } : {})}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </NavItems>
      </ClickAwayListener>
    </Popper>
  );
}

export interface NavPopperProps {
  anchorId: string | null;
  items: NavItem[];
}

const NavItems = styled.div({
  display: 'flex',
  flexDirection: 'column',
});
