import { useRef } from 'react';
import styled from '@emotion/styled';
import { Popper as MuiPopper, PopperProps, Paper } from '@mui/material';

export default function Popper({ children, ...props }: PopperProps) {
  const arrowRef = useRef<HTMLDivElement | null>(null);

  return (
    <StyledPopper {...props}>
      {(popperProps) => (
        <>
          <div ref={arrowRef} className="arrow" />
          <Paper>
            {typeof children === 'function' ? children(popperProps) : children}
          </Paper>
        </>
      )}
    </StyledPopper>
  );
}

const StyledPopper = styled(MuiPopper)(({ theme }) => {
  const arrowSize = '0.45rem';
  const arrowOffset = '0.5rem';

  return {
    zIndex: theme.zIndex.tooltip,

    // Bottom placements
    '&[data-popper-placement="bottom"] .arrow': {
      top: 0,
      left: `calc(50% - ${arrowSize})`,
      transform: 'translateX(-50%)',
      marginTop: `-${arrowSize}`,
      '&::before': {
        borderWidth: `0 ${arrowSize} ${arrowSize} ${arrowSize}`,
        borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
      },
    },
    '&[data-popper-placement="bottom-start"] .arrow': {
      top: 0,
      left: arrowOffset,
      marginTop: `-${arrowSize}`,
      '&::before': {
        borderWidth: `0 ${arrowSize} ${arrowSize} ${arrowSize}`,
        borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
      },
    },
    '&[data-popper-placement="bottom-end"] .arrow': {
      top: 0,
      right: arrowOffset,
      marginTop: `-${arrowSize}`,
      '&::before': {
        borderWidth: `0 ${arrowSize} ${arrowSize} ${arrowSize}`,
        borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
      },
    },

    // Top placements
    '&[data-popper-placement="top"] .arrow': {
      bottom: 0,
      left: `calc(50% - ${arrowSize})`,
      transform: 'translateX(-50%)',
      marginBottom: `-${arrowSize}`,
      '&::before': {
        borderWidth: `${arrowSize} ${arrowSize} 0 ${arrowSize}`,
        borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
      },
    },
    '&[data-popper-placement="top-start"] .arrow': {
      bottom: 0,
      left: arrowOffset,
      marginBottom: `-${arrowSize}`,
      '&::before': {
        borderWidth: `${arrowSize} ${arrowSize} 0 ${arrowSize}`,
        borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
      },
    },
    '&[data-popper-placement="top-end"] .arrow': {
      bottom: 0,
      right: arrowOffset,
      marginBottom: `-${arrowSize}`,
      '&::before': {
        borderWidth: `${arrowSize} ${arrowSize} 0 ${arrowSize}`,
        borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
      },
    },

    // Right placements
    '&[data-popper-placement="right"] .arrow': {
      left: 0,
      top: `calc(50% - ${arrowSize})`,
      transform: 'translateY(-50%)',
      marginLeft: `-${arrowSize}`,
      '&::before': {
        borderWidth: `${arrowSize} ${arrowSize} ${arrowSize} 0`,
        borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
      },
    },
    '&[data-popper-placement="right-start"] .arrow': {
      left: 0,
      top: arrowOffset,
      marginLeft: `-${arrowSize}`,
      '&::before': {
        borderWidth: `${arrowSize} ${arrowSize} ${arrowSize} 0`,
        borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
      },
    },
    '&[data-popper-placement="right-end"] .arrow': {
      left: 0,
      bottom: arrowOffset,
      marginLeft: `-${arrowSize}`,
      '&::before': {
        borderWidth: `${arrowSize} ${arrowSize} ${arrowSize} 0`,
        borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
      },
    },

    // Left placements
    '&[data-popper-placement="left"] .arrow': {
      right: 0,
      top: `calc(50% - ${arrowSize})`,
      transform: 'translateY(-50%)',
      marginRight: `-${arrowSize}`,
      '&::before': {
        borderWidth: `${arrowSize} 0 ${arrowSize} ${arrowSize}`,
        borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
      },
    },
    '&[data-popper-placement="left-start"] .arrow': {
      right: 0,
      top: arrowOffset,
      marginRight: `-${arrowSize}`,
      '&::before': {
        borderWidth: `${arrowSize} 0 ${arrowSize} ${arrowSize}`,
        borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
      },
    },
    '&[data-popper-placement="left-end"] .arrow': {
      right: 0,
      bottom: arrowOffset,
      marginRight: `-${arrowSize}`,
      '&::before': {
        borderWidth: `${arrowSize} 0 ${arrowSize} ${arrowSize}`,
        borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
      },
    },

    // Arrow base styles
    '& .arrow': {
      position: 'absolute',
      width: arrowSize,
      height: arrowSize,
      pointerEvents: 'none',
      '&::before': {
        content: '""',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid',
      },
    },
  };
});
