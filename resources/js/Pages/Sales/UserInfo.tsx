import * as React from 'react';
import Popover from '@/src/lib/piwi/core/Popover';
import Typography from '@mui/material/Typography';

export default function UserInfo({ user: { name, email } }: UserInfoProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {name}
      </Typography>
      <Popover
        id="mouse-over-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
      >
        <Typography sx={{ p: 1 }} variant="subtitle1">
          {email}
        </Typography>
      </Popover>
    </div>
  );
}

export interface UserInfoProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
}
