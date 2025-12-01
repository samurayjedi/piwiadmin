import { useState } from 'react';
import { Link } from '@inertiajs/react';
import styled from '@emotion/styled';
import clsx from 'clsx';
import { Button, Skeleton, Typography } from '@mui/material';
import { useAppPage } from '@/hooks';
import TrailBorder from '@/src/lib/piwi/animated/TrailBorder';
import NavPopper from './NavPopper';

export default function NavMenu({ items, loading }: NavProps) {
  const { url } = useAppPage();
  const [anchorId, setAnchorId] = useState<string | null>(null);
  const onMouseOver = (id: string) => () => setAnchorId(id);
  const onMouseLeave = () => setAnchorId(null);
  const activeAnchorId = (() => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemUrl = item.link ? new URL(item.link).pathname : '';
      if (itemUrl === url) {
        return `link-${item.key}`;
      }
      if (item.subItems) {
        for (let j = 0; j < item.subItems.length; j++) {
          const subItem = item.subItems[j];
          const subItemUrl = subItem.link ? new URL(subItem.link).pathname : '';
          if (subItemUrl === url) {
            return `link-${item.key}`;
          }
        }
      }
    }

    return null;
  })();
  const isActive = (item: NavParentItem) => {
    const itemUrl = item.link ? new URL(item.link).pathname : '';
    if (itemUrl === url) {
      return true;
    }
    if (item.subItems) {
      for (let i = 0; i < item.subItems.length; i++) {
        const subItem = item.subItems[i];
        const subItemUrl = subItem.link ? new URL(subItem.link).pathname : '';
        if (subItemUrl === url) {
          return true;
        }
      }
    }

    return false;
  };
  let elId = anchorId ?? activeAnchorId;
  if (loading) {
    elId = null;
  }

  return (
    <Container>
      {elId && <TrailBorder anchorId={elId} />}
      {items.map((item) => {
        const id = `link-${item.key}`;

        return loading ? (
          <Skeleton key={id} sx={{ mr: 1 }}>
            <Typography variant="h6">{item.label}</Typography>
          </Skeleton>
        ) : (
          <NavItemContainer
            key={id}
            id={id}
            onMouseOver={onMouseOver(id)}
            onMouseLeave={onMouseLeave}
          >
            <LinkButton
              className={clsx({
                active:
                  (!anchorId && isActive(item)) ||
                  (anchorId === id && item.subItems),
              })}
              variant="text"
              {...(item.link ? { LinkComponent: Link, href: item.link } : {})}
            >
              {item.label}
            </LinkButton>
            {anchorId === id && item.subItems && (
              <NavPopper anchorId={anchorId} items={item.subItems} />
            )}
          </NavItemContainer>
        );
      })}
    </Container>
  );
}

export interface NavProps {
  items: NavParentItem[];
  loading?: boolean;
}

type NavParentItem = NavItem & {
  subItems?: NavItem[];
};

export interface NavItem {
  key: string;
  label: string;
  link?: string;
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
});

const NavItemContainer = styled.div({});

const LinkButton = styled(Button)(({ theme }) => ({
  fontSize: '0.9',
  color: theme.palette.grey[600],
  '&:hover, &.active': {
    color: theme.palette.common.black,
  },
  paddingBottom: 12,
  paddingTop: 12,
  borderRadius: 0,
}));
