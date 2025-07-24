import { IconButton, Skeleton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppSelector } from '@/store/hooks';

export default function Notifications() {
  const sync = useAppSelector((state) => state.app.sync);

  if (sync === 'ok') {
    return (
      <IconButton size="small">
        <NotificationsIcon />
      </IconButton>
    );
  }

  return (
    <Skeleton variant="rounded" sx={{ mr: 1 }}>
      <IconButton size="small">
        <NotificationsIcon />
      </IconButton>
    </Skeleton>
  );
}
