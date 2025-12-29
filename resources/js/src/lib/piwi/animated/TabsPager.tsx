import React, { useState } from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import { Tabs as MUITabs, Tab as MUITab, Slide } from '@mui/material';

export default function TabsPager({
  tabs,
  tabSize = 'default',
  children,
  tabsPosition = 'top',
  additional = null,
}: TabsPagerProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  if (Object.keys(tabs).length !== React.Children.count(children)) {
    throw new Error('Number of childs !== tabs count.');
  }

  const onTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setDirection(newValue > index ? 'left' : 'right');
    setIndex(newValue);
  };

  return (
    <Wrapper>
      {tabsPosition === 'top' && (
        <TabsContainer>
          <Tabs value={index} onChange={onTabChange}>
            {_.map(tabs, (value, key) => (
              <Tab key={`tab-${key}`} label={value} size={tabSize} />
            ))}
          </Tabs>
          <Additional>{additional}</Additional>
        </TabsContainer>
      )}
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
      {tabsPosition === 'bottom' && (
        <TabsContainer>
          <BottomTabs value={index} onChange={onTabChange}>
            {_.map(tabs, (value, key) => (
              <Tab key={`tab-${key}`} label={value} size={tabSize} />
            ))}
          </BottomTabs>
          <Additional>{additional}</Additional>
        </TabsContainer>
      )}
    </Wrapper>
  );
}

export interface TabsPagerProps {
  tabs: Record<string, string>;
  children: React.ReactNode;
  tabSize?: 'small' | 'default';
  tabsPosition?: 'top' | 'bottom';
  additional?: React.ReactNode;
}

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: theme.spacing(1),
}));

const TabsContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
});

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

const Additional = styled.div({
  display: 'block',
  borderTop: '2px solid #e0e0e0',
});

const Tabs = styled(MUITabs)({
  flex: 1,
});

const BottomTabs = styled(MUITabs)(({ theme }) => ({
  flex: 1,
  borderTop: '2px solid #e0e0e0',
  '& .MuiTabs-indicator': {
    top: 0,
    backgroundColor: theme.palette.primary.main,
  },
}));
