import React, { useState } from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import { Tabs, Tab as MUITab, Slide } from '@mui/material';

export default function TabsPager({
  tabs,
  tabSize = 'default',
  children,
}: TabsPagerProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  if (Object.keys(tabs).length !== React.Children.count(children)) {
    throw new Error('Number of childs !== tabs count.');
  }

  return (
    <Wrapper>
      <Tabs
        value={index}
        onChange={(event, newValue: number) => {
          setDirection(newValue > index ? 'left' : 'right');
          setIndex(newValue);
        }}
      >
        {_.map(tabs, (value, key) => (
          <Tab key={`tab-${key}`} label={value} size={tabSize} />
        ))}
      </Tabs>
      {React.Children.map(children, (child, i) => (
        <Slide
          key={`slide-tab-${tabs[i]}`}
          in={index === i}
          mountOnEnter
          unmountOnExit
          direction={direction}
          timeout={300}
        >
          <SlideWrapper>
            <SlideItem active={index === i}>{child as any}</SlideItem>
          </SlideWrapper>
        </Slide>
      ))}
    </Wrapper>
  );
}

export interface TabsPagerProps {
  tabs: Record<string, string>;
  children: React.ReactNode;
  tabSize?: 'small' | 'default';
}

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: theme.spacing(1),
}));

const SlideWrapper = styled.div({
  position: 'relative',
});

const SlideItem = styled.div<{ active: boolean }>(({ active }) => ({
  position: active ? 'relative' : 'absolute',
}));

const Tab = styled(MUITab)<{ size: TabsPagerProps['tabSize'] }>(({ size }) => ({
  ...(() => {
    switch (size) {
      case 'small':
        return { fontSize: 10 };
    }

    return {};
  })(),
}));
