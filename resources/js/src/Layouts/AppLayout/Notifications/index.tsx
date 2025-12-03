import { useCallback, useState, useMemo } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Skeleton,
  Badge,
  Button,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppSelector } from '@/store/hooks';
import Popper from '@/src/lib/piwi/core/Popper';
import { useNotifications } from './hooks';

export default function Notifications() {
  const sync = useAppSelector((state) => state.app.sync);

  if (sync === 'ok') {
    return <NotificationIconButton />;
  }

  return (
    <Skeleton variant="rounded" sx={{ mr: 1 }}>
      <NotificationIconButton />
    </Skeleton>
  );
}

function NotificationIconButton() {
  const { t } = useTranslation();
  const notifications = useNotifications();
  const popoverId = useMemo(() => _.uniqueId('popover-notification_'), []);
  const [noteAnchor, setNoteAnchor] = useState<HTMLElement | null>(null);

  const onClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setNoteAnchor(event.currentTarget);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setNoteAnchor(null);
  }, []);

  return (
    <>
      <IconButton
        size="small"
        aria-label={`You have ${notifications.length} notifications.`}
        aria-owns={noteAnchor !== null ? popoverId : undefined}
        aria-haspopup="true"
        onClick={onClick}
        title={t('Click for view notifications.')}
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popper
        id={popoverId}
        open={noteAnchor !== null}
        anchorEl={noteAnchor}
        placement="bottom"
      >
        <ClickAwayListener onClickAway={handlePopoverClose}>
          <NotificationsContainer>
            <Scrollable>
              <List dense>
                {notifications.length ? (
                  notifications.map((notification) => {
                    const {
                      primary,
                      secondary,
                      action,
                      route_name,
                      route_attrs,
                    } = notification.data;

                    return (
                      <ListItemButton
                        key={`notification-${notification.id}`}
                        title={action}
                        onClick={() => {
                          handlePopoverClose();
                          router.visit(
                            route('notifications.notification.markAsRead', {
                              notificationId: notification.id,
                              redirect: route_name,
                              redirect_attrs: route_attrs,
                            }),
                          );
                        }}
                      >
                        <ListItemText primary={primary} secondary={secondary} />
                      </ListItemButton>
                    );
                  })
                ) : (
                  <ListItemButton>
                    <ListItemText primary={t('No notifications.')} />
                  </ListItemButton>
                )}
              </List>
            </Scrollable>
            {notifications.length > 0 && (
              <Button
                variant="text"
                color="warning"
                onClick={() => {
                  handlePopoverClose();
                  router.get(route('notifications.markAllAsRead'));
                }}
              >
                {t('Clear')}
              </Button>
            )}
          </NotificationsContainer>
        </ClickAwayListener>
      </Popper>
    </>
  );
}

const NotificationsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Scrollable = styled.div({
  maxHeight: 300,
  overflow: 'auto',
});
