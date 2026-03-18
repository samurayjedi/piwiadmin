import { useState, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import { route } from 'ziggy-js';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ClickAwayListener,
} from '@mui/material';
import RuleIcon from '@mui/icons-material/Rule';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Dropdown from '@/src/lib/piwi/animated/Dropdown';
import Skeleton from '@/src/Components/Skeleton';
import Popper from '@/src/lib/piwi/core/Popper';

export default function UserDropdown() {
  const { t } = useTranslation();
  const ref = useRef<HTMLButtonElement | null>(null);
  const [on, setOn] = useState(false);
  // const { props } = usePage();
  // const email = _.get(props, 'auth.user.email', '') as string;

  const onClick = useCallback(() => setOn((prev) => !prev), []);
  const onClickAway = useCallback(() => setOn(false), []);

  return (
    <>
      <Skeleton variant="rounded" sx={{ mr: 1 }}>
        <LoginButton
          onClick={onClick}
          variant="text"
          endIcon={<Dropdown on={on} sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />}
          ref={ref}
        >
          <AccountBoxIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
        </LoginButton>
      </Skeleton>
      <Popper open={on} anchorEl={ref.current} placement="bottom">
        <ClickAwayListener onClickAway={onClickAway}>
          <List disablePadding dense>
            <ListItem disablePadding>
              <ListItemButton LinkComponent={Link} href={route('profile.edit')}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('Settings')}</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                LinkComponent={Link}
                href={route('authorized_users')}
              >
                <ListItemIcon>
                  <HowToRegIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('Manage users')}</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton LinkComponent={Link} href={route('roles')}>
                <ListItemIcon>
                  <RuleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('Roles')}</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                LinkComponent={Link}
                href={route('logout')}
                {...{ method: 'post' }}
              >
                <ListItemIcon>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('Logout')}</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </ClickAwayListener>
      </Popper>
    </>
  );
}

const LoginButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black,
  textTransform: 'lowercase',
  fontWeight: 'normal',
}));
