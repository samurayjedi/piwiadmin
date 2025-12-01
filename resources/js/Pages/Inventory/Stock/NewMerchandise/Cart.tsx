import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import _ from 'lodash';
import {
  IconButton,
  Badge,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ClickAwayListener,
} from '@mui/material';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Popper from '@/src/lib/piwi/core/Popper';

export default function Cart({
  selectedProducts,
  count,
  onClickGo,
}: CartProps) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const popoverId = useMemo(() => _.uniqueId('popover-notification_'), []);

  return (
    <>
      <CartIconButton
        aria-label={`You have ${count} selected.`}
        aria-owns={anchor !== null ? popoverId : undefined}
        onClick={(e) => {
          setAnchor((prev) => {
            if (count > 0) {
              const p = Boolean(prev);
              if (!p) {
                return e.currentTarget;
              }
            }

            return null;
          });
        }}
      >
        <Badge badgeContent={count} color="info">
          <ShoppingBasketIcon />
        </Badge>
      </CartIconButton>
      {count > 0 && (
        <Popper
          id={popoverId}
          open={anchor !== null}
          anchorEl={anchor}
          placement="bottom"
        >
          <ClickAwayListener onClickAway={() => setAnchor(null)}>
            <List
              dense
              subheader={<ListSubheader>{t('Products')}</ListSubheader>}
            >
              {_.map(selectedProducts, (product) => (
                <ListItem key={`cart-popper-list-item-${product.id}`}>
                  <ListItemText primary={product.name} />
                </ListItem>
              ))}
              <ListItemButton
                onClick={() => {
                  setAnchor(null);
                  onClickGo();
                }}
              >
                <ListItemIcon>
                  <CallMissedOutgoingIcon />
                </ListItemIcon>
                <ListItemText primary={t('Go to details')} />
              </ListItemButton>
            </List>
          </ClickAwayListener>
        </Popper>
      )}
    </>
  );
}

export interface CartProps {
  selectedProducts: Record<string, Product>;
  count: number;
  onClickGo: () => void;
}

const CartIconButton = styled(IconButton)({
  position: 'absolute',
  top: 8,
  right: 8,
});
