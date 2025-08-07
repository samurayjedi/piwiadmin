import React from 'react';
import styled from '@emotion/styled';
import { Container } from '@mui/material';
import DolarSync from '@/src/DolarSync';
import PrimaryAppBar from './PrimaryAppBar';
import Breadcrumbs from './Breadcrumbs';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DolarSync>
      <PrimaryAppBar />
      <Container maxWidth="lg">
        <BreadcrumbsContainer>
          <Breadcrumbs />
        </BreadcrumbsContainer>
        {children}
      </Container>
    </DolarSync>
  );
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
