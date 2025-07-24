import React from 'react';
import styled from '@emotion/styled';
import { AppBar as MUIAppBar, Toolbar, Container } from '@mui/material';
import PrimaryAppBar from './PrimaryAppBar';
import Breadcrumbs from './Breadcrumbs';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PrimaryAppBar />
      <SecondaryAppBar color="default">
        <Container maxWidth="lg">
          <Toolbar variant="dense">
            <Breadcrumbs />
          </Toolbar>
        </Container>
      </SecondaryAppBar>
      {children}
    </>
  );
}

const SecondaryAppBar = styled(MUIAppBar)(({ theme }) => ({
  position: 'relative',
  boxShadow: 'none',
  marginBottom: theme.spacing(4),
}));
