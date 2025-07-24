import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
  Container as MuiContainer,
  ContainerProps,
  Paper as MuiPaper,
} from '@mui/material';
import Logo from '../Logo';

export default function Layout({ children }: { children: ReactNode }) {
  return <FormContainer>{children}</FormContainer>;
}

export function FormContainer({ children, ...rest }: ContainerProps) {
  const { component } = usePage();
  const { t } = useTranslation();

  return (
    <Container maxWidth={false} disableGutters {...rest}>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <Paper label={t(component)}>{children}</Paper>
    </Container>
  );
}

const Container = styled(MuiContainer)(({ theme }) => ({
  width: '100vw',
  minHeight: '100vh',
  height: 'fit-content',
  backgroundColor: theme.palette.primary.light,
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const LogoWrapper = styled.div(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const headerSize = 60;
const triangleSize = 32;
const Paper = styled(MuiPaper)<{ label: string }>(({ theme, label }) => ({
  position: 'relative',
  width: 500,
  '&::before': {
    content: `"${label}"`,
    color: theme.palette.common.white,
    fontSize: theme.typography.h6.fontSize,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: headerSize,
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: theme.spacing(6),
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    fontSize: `calc(${triangleSize}px / 2)`,
    margin: '0 auto',
    width: 0,
    height: 0,
    top: headerSize, // ::before height
    left: `calc(50% - calc(${triangleSize}px / 2))`,
    borderLeft: '1em solid transparent',
    borderRight: '1em solid transparent',
    borderTop: `1em solid ${theme.palette.primary.main}`,
  },
  '& .auth-form-content': {
    padding: `0 ${theme.spacing(2)} ${theme.spacing(2)}`,
  },
  '& .auth-form-footer': {
    width: '100%',
    color: theme.palette.common.white,
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    borderbottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    '& a': {
      color: 'currentColor',
    },
  },
}));
