import { ReactNode } from 'react';
import styled from '@emotion/styled';

export default function Section({
  children,
  title,
  direction = 'column',
}: {
  children: ReactNode;
  title: string;
  direction?: 'column' | 'row';
}) {
  return (
    <Supervaca>
      <SectionTitle title={title} />
      <SectionContent direction={direction}>{children}</SectionContent>
    </Supervaca>
  );
}

const Supervaca = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const SectionTitle = styled.div<{ title: string }>(({ theme, title }) => ({
  width: 'fit-content',
  overflow: 'hidden',
  position: 'relative',
  padding: '4px 0',
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(3),
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: -7,
    zIndex: 1,
    width: '100%',
    height: 31,
    backgroundColor: theme.palette.primary.main,
    transform: 'skew(-20deg)',
    borderTopLeftRadius: 4, // the same as paper
  },
  '&::after': {
    content: `"${title}"`,
    position: 'relative',
    zIndex: 2,
    color: theme.palette.common.white,
    ...(theme.typography.subtitle1 as unknown as object),
  },
}));

const SectionContent = styled.div<{ direction: 'row' | 'column' }>(
  ({ theme, direction }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: direction,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    color: 'rgba(0, 0, 0, 0.6)',
    '& .MuiInput-root': {
      minWidth: 150,
    },
    flexWrap: 'wrap',
  }),
);
