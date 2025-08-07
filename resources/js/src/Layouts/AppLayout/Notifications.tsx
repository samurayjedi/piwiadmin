import { useCallback, useState, useMemo } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Skeleton,
  Badge,
  Typography as MUITypography,
  Button,
  ClickAwayListener,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppSelector } from '@/store/hooks';
import { useAppPage } from '@/hooks';
import Popper from '@/src/lib/piwi/core/Popper';

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
  const {
    props: { notifications },
  } = useAppPage();
  const { t } = useTranslation();
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
            {notifications.length ? (
              notifications.map((notification) => (
                <Notification>
                  <Typography
                    key={`notification-${notification.id}`}
                    variant="subtitle1"
                  >
                    {notification.data.message}
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      handlePopoverClose();
                      router.get(
                        route('notifications.notification.markAsRead', {
                          notificationId: notification.id,
                        }),
                        {},
                        {
                          onFinish: () => {
                            router.visit(route(notification.data.route));
                          },
                        },
                      );
                    }}
                  >
                    {notification.data.action}
                  </Button>
                </Notification>
              ))
            ) : (
              <Typography variant="caption">
                {t('No notifications.')}
              </Typography>
            )}
          </NotificationsContainer>
        </ClickAwayListener>
      </Popper>
    </>
  );
}

const NotificationsContainer = styled.div(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  flexDirection: 'column',
}));

const Typography = styled(MUITypography)({
  flex: 1,
});

const Notification = styled.div({
  display: 'flex',
  flexDirection: 'row',
});
