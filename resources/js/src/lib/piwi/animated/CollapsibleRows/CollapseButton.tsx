import { Button, ButtonProps } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Dispatch, SetStateAction } from 'react';

export default function CollapseButton({
  active,
  ...props
}: CollapseButtonProps) {
  return (
    <Button
      {...props}
      startIcon={!active ? <ExpandMoreIcon /> : <ExpandLessIcon />}
    />
  );
}

export function defaultCollapseCallback(
  i: number,
  setActiveIndex: Dispatch<SetStateAction<number>>,
) {
  setActiveIndex((prev) => {
    if (prev === i) {
      return -1;
    }

    return i;
  });
}

export interface CollapseButtonProps extends Omit<ButtonProps, 'startIcon'> {
  active: boolean;
}
