import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  AppBar as MUIAppBar,
  Toolbar,
  Container,
  Box,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Logo from '@/src/Logo';
import NavMenu from '@/src/lib/piwi/core/NavMenu';
import { useAppSelector } from '@/store/hooks';
import LoginDropdown from './LoginDropdown';
import Notifications from './Notifications';
import DolarPrice from './DolarPrice';

export default function PrimaryAppBar() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sync = useAppSelector((state) => state.app.sync);

  return (
    <AppBar color="default">
      <Container maxWidth="lg">
        <Toolbar variant="dense" className="first-toolbar">
          <Logo size={46} />
          {!isMobile && (
            <>
              <div className="spacing" />
              <NavMenu
                loading={sync !== 'ok'}
                items={[
                  {
                    key: 'dashboard',
                    label: t('Dashboard'),
                    link: route('dashboard'),
                  },
                  {
                    key: 'sales',
                    label: t('Sales'),
                    subItems: [
                      {
                        key: 'new-sale',
                        label: t('New sale'),
                        link: route('sales.new_sale'),
                      },
                      {
                        key: 'sales-listing',
                        label: t('Listing'),
                        link: route('sales'),
                      },
                      {
                        key: 'sale-listing-cash',
                        label: t('Cash'),
                        link: route('sale_type', { sale_type: 'cash' }),
                      },
                      {
                        key: 'sale-listing-credit',
                        label: t('Credit'),
                        link: route('sale_type', { sale_type: 'credit' }),
                      },
                      {
                        key: 'sale-listing-layaway',
                        label: t('Layaway'),
                        link: route('sale_type', { sale_type: 'layaway' }),
                      },
                    ],
                  },
                  {
                    key: 'products',
                    label: t('Products'),
                    subItems: [
                      {
                        key: 'inventory',
                        label: t('Inventory'),
                        link: route('inventory'),
                      },
                      {
                        key: 'categories',
                        label: t('Categories'),
                        link: route('categories'),
                      },
                      {
                        key: 'brands',
                        label: t('Brands'),
                        link: route('brands'),
                      },
                    ],
                  },
                  {
                    key: 'clients_payments',
                    label: t('Clients'),
                    subItems: [
                      {
                        key: 'clients',
                        label: t('Clients'),
                        link: route('clients'),
                      },
                      {
                        key: 'payment_methods',
                        label: t('Payment Methods'),
                        link: route('payment_methods'),
                      },
                    ],
                  },
                  {
                    key: 'charts',
                    label: t('Charts'),
                    link: route('charts'),
                  },
                ]}
              />
            </>
          )}
          <Box sx={{ flex: 1 }} />
          <DolarPrice />
          <LoginDropdown />
          <Notifications />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const AppBar = styled(MUIAppBar)(({ theme }) => ({
  position: 'relative',
  boxShadow: 'none',
  zIndex: 1050,
  borderBottom: `2px solid ${theme.palette.divider}`,
  '& .MuiToolbar-root.first-toolbar': {
    position: 'relative',
    top: 2,
  },
}));
