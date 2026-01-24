import React from 'react';
import { Head } from '@inertiajs/react';
import styled from '@emotion/styled';
import { Container } from '@mui/material';
import DolarSync from '@/src/DolarSync';
import { useAppPage } from '@/hooks';
import PrimaryAppBar from './PrimaryAppBar';
import Breadcrumbs from './Breadcrumbs';

export default function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  const {
    props: { company },
  } = useAppPage();
  const { name } = company as Record<string, string>;

  return (
    <>
      <Head title={name} />
      <DolarSync>
        <PrimaryAppBar />
        <Container maxWidth="lg" sx={{ paddingBottom: '90px' }}>
          <BreadcrumbsContainer>
            {breadcrumbs ?? <Breadcrumbs />}
          </BreadcrumbsContainer>
          {children}
        </Container>
      </DolarSync>
    </>
  );
}

export interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: React.ReactNode;
}

const BreadcrumbsContainer = styled.div(({ theme }) => ({
  display: 'block',
  padding: theme.spacing(1),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  borderColor: theme.palette.grey[300],
  borderWidth: 1,
  borderStyle: 'solid',
}));
