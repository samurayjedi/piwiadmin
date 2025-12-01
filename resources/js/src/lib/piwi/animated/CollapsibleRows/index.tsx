import React, { Dispatch, SetStateAction, useState } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { Collapse, TableCell, TableRow } from '@mui/material';

export default function CollapsibleRows({
  children,
  colSpan,
}: CollapsibleRowsProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const childs = children(activeIndex, setActiveIndex);

  return childs.map((child, i) => (
    <React.Fragment key={_.uniqueId(`collapsible-row-${i}-`)}>
      <TableRow>{child[0]}</TableRow>
      <TableRow>
        <CollapsibleCell colSpan={colSpan}>
          <Collapse in={i === activeIndex} timeout="auto" unmountOnExit>
            <Wrapper>{child[1]}</Wrapper>
          </Collapse>
        </CollapsibleCell>
      </TableRow>
    </React.Fragment>
  ));
}

export interface CollapsibleRowsProps {
  children: (
    activeIndex: number,
    setActiveIndex: Dispatch<SetStateAction<number>>,
  ) => React.ReactNode[][];
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
});
