import React, { useState, useCallback } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import clsx from 'clsx';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
  AppBar as MUIAppBar,
  Toolbar,
  Container,
  Button,
  Box,
  useMediaQuery,
  Skeleton,
  ButtonProps,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import Logo from '@/src/Logo';
import TrailBorder from '@/src/lib/piwi/animated/TrailBorder';
import { useAppSelector } from '@/store/hooks';
import LoginDropdown from './LoginDropdown';
import Notifications from './Notifications';

export default function PrimaryAppBar() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { component } = usePage();
  const activeLink = `link-${component}`;
  const [hoverLink, setHoverLink] = useState<string | null>(null);

  const onMouseOver = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
      setHoverLink(_.get(ev, 'target.id', '')),
    [],
  );

  const onMouseLeave = useCallback(() => setHoverLink(null), []);

  return (
    <AppBar color="default">
      <Container maxWidth="lg">
        <Toolbar variant="dense" className="first-toolbar">
          <Logo size={46} />
          {!isMobile && (
            <>
              <div className="spacing" />
              <LinkButton
                id="link-Dashboard"
                className={clsx({ active: component === 'Dashboard' })}
                variant="text"
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
              >
                {t('Dashboard')}
              </LinkButton>
              <LinkButton
                id="link-test"
                variant="text"
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
              >
                {t('Sales')}
              </LinkButton>
              <LinkButton
                id="link-test2"
                variant="text"
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
              >
                {t('Products')}
              </LinkButton>
            </>
          )}
          <Box sx={{ flex: 1 }} />
          <Notifications />
          <LoginDropdown />
        </Toolbar>
      </Container>
      <TrailBorder anchorId={hoverLink ?? activeLink} />
    </AppBar>
  );
}

const AppBar = styled(MUIAppBar)(({ theme }) => ({
  position: 'relative',
  boxShadow: 'none',
  zIndex: 1050,
  borderBottom: `2px solid ${theme.palette.divider}`,
  '& .MuiToolbar-root.first-toolbar': {
    position: 'relative',
    top: 2,
  },
}));

const StyledLinkButton = styled(Button)(({ theme }) => ({
  fontSize: '0.9',
  color: theme.palette.grey[600],
  '&:first-child': {},
  '&:hover, &.active': {
    color: theme.palette.common.black,
  },
  paddingBottom: 12,
  paddingTop: 12,
  borderRadius: 0,
}));

const StyledSkeleton = styled(Skeleton)(({ theme }) => ({
  fontSize: '0.9',
  marginRight: theme.spacing(1),
  paddingBottom: '12px',
  paddingTop: '12px',
  width: '100px',
}));

function LinkButton(props: ButtonProps) {
  const sync = useAppSelector((state) => state.app.sync);

  if (sync === 'ok') {
    return <StyledLinkButton {...props} />;
  }

  return <StyledSkeleton id="link-Dashboard" variant="rectangular" />;
}
