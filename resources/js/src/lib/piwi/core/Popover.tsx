import styled from '@emotion/styled';
import { Popover as MuiPopover, PopoverProps } from '@mui/material';

export default function Popover(props: PopoverProps) {
  return (
    <StyledPopover
      {...props}
      anchorOrigin={
        props.anchorOrigin ?? {
          vertical: 'bottom',
          horizontal: 'left',
        }
      }
      transformOrigin={
        props.transformOrigin ?? {
          vertical: 'top',
          horizontal: 'left',
        }
      }
      disableRestoreFocus={props.disableRestoreFocus ?? false}
    />
  );
}

const StyledPopover = styled(MuiPopover)({
  pointerEvents: 'none',
  '& .MuiPopover-paper': {
    zIndex: 99999,
  },
});
