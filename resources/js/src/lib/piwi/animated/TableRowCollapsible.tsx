import React, { Dispatch, SetStateAction } from 'react';
import styled from '@emotion/styled';
import {
  Collapse,
  TableCell,
  TableRow,
  Button,
  ButtonProps,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function TableRowCollapsible({
  collapsed,
  children,
  colSpan,
  collapsedChildren,
}: CollapsibleRowsProps) {
  return (
    <>
      <TableRow>{children}</TableRow>
      <TableRow>
        <CollapsibleCell colSpan={colSpan}>
          <Collapse in={collapsed} timeout="auto" unmountOnExit>
            <Wrapper>{collapsedChildren}</Wrapper>
          </Collapse>
        </CollapsibleCell>
      </TableRow>
    </>
  );
}

export function CollapseButton({ active, ...props }: CollapseButtonProps) {
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

export interface CollapsibleRowsProps {
  collapsed: boolean;
  children: React.ReactNode;
  collapsedChildren: React.ReactNode;
  colSpan?: number;
}

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const CollapsibleCell = styled(TableCell)({
  paddingTop: 0,
  paddingBottom: 0,
  '& table tbody tr:last-child td': {
    borderWidth: 0,
  },
});
