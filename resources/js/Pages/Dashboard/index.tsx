import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import { Link } from '@inertiajs/react';
import { Paper as MUIPaper, Button } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import AppLayout from '@/src/Layouts/AppLayout';
import Section from '@/src/Components/Section';
import StatusAlert from '@/src/Components/StatusAlert';
import GroupIcon from '@mui/icons-material/Group';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PaymentsIcon from '@mui/icons-material/Payments';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PiwiSkeleton from '@/src/Components/Skeleton';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <PiwiContainer>
        <SidebarContainer>
          <Sidebar />
        </SidebarContainer>
        <Content>
          <Paper>
            <StatusAlert />
            <Section title={t('Sales')} direction="row">
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('sales.new_sale')}
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                >
                  {t('New sale')}
                </CardButton>
              </Skeleton>
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('sales')}
                  variant="contained"
                  startIcon={<ChecklistIcon />}
                >
                  {t('Listing')}
                </CardButton>
              </Skeleton>
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('sale_type', { sale_type: 'cash' })}
                  variant="contained"
                  startIcon={<PaymentsIcon />}
                >
                  {t('Cash')}
                </CardButton>
              </Skeleton>
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('sale_type', { sale_type: 'credit' })}
                  variant="contained"
                  startIcon={<CreditCardIcon />}
                >
                  {t('Credit')}
                </CardButton>
              </Skeleton>
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('sale_type', { sale_type: 'layaway' })}
                  variant="contained"
                  startIcon={<BookmarksIcon />}
                >
                  {t('Layaway')}
                </CardButton>
              </Skeleton>
            </Section>
            <Section title={t('Products')} direction="row">
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('inventory')}
                  variant="contained"
                  startIcon={<InventoryIcon />}
                >
                  {t('Inventory')}
                </CardButton>
              </Skeleton>
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('categories')}
                  variant="contained"
                  startIcon={<CategoryIcon />}
                >
                  {t('Categories')}
                </CardButton>
              </Skeleton>
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('brands')}
                  variant="contained"
                  startIcon={<LocalOfferIcon />}
                >
                  {t('Brands')}
                </CardButton>
              </Skeleton>
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('stock')}
                  variant="contained"
                  startIcon={<AllInboxIcon />}
                >
                  {t('Stock')}
                </CardButton>
              </Skeleton>
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('inventory.stock.payable_accounts')}
                  variant="contained"
                  startIcon={<AccountBalanceWalletIcon />}
                >
                  {t('Payable accounts')}
                </CardButton>
              </Skeleton>
            </Section>
            <Section title={t('Clients & Payments')} direction="row">
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('clients')}
                  variant="contained"
                  startIcon={<GroupIcon />}
                >
                  {t('Clients')}
                </CardButton>
              </Skeleton>
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('payment_methods')}
                  variant="contained"
                  startIcon={<PointOfSaleIcon />}
                >
                  {t('Payment methods')}
                </CardButton>
              </Skeleton>
            </Section>
            <Section title={t('Reports')} direction="row">
              <Skeleton variant="rounded">
                <CardButton
                  LinkComponent={Link}
                  href={route('charts')}
                  variant="contained"
                  startIcon={<BarChartIcon />}
                >
                  {t('Charts')}
                </CardButton>
              </Skeleton>
            </Section>
          </Paper>
        </Content>
      </PiwiContainer>
    </AppLayout>
  );
}

const Paper = styled(MUIPaper)({
  display: 'flex',
  flexDirection: 'column',
});

const CardButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: 150,
    height: 140,
    '& .MuiButton-startIcon': {
      margin: 0,
      marginBottom: theme.spacing(2),
      '& svg': {
        fontSize: 48,
      },
    },
  },
  width: 120,
  height: 110,
  '& .MuiButton-startIcon': {
    margin: 0,
    marginBottom: theme.spacing(2),
    '& svg': {
      fontSize: 32,
    },
  },
  display: 'flex',
  flexFlow: 'column',
  borderRadius: 0,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[50],
  boxShadow:
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  textTransform: 'none',
  transition: 'transform .3s ease-in, color .3s ease-in',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.text.primary,
    transform: 'scale(1.1)',
  },
  '&:not(:last-child)': {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const PiwiContainer = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: `min-content ${theme.spacing(1)} 1fr`,
  [`${theme.breakpoints.up('md')}`]: {
    gridTemplateColumns: `0.9fr ${theme.spacing(1)} 3fr`,
    gridTemplateRows: 'min-content',
  },
}));

const SidebarContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Content = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gridRowStart: 3,
  gridRowEnd: 4,
  [`${theme.breakpoints.up('md')}`]: {
    gridRowStart: 'initial',
    gridRowEnd: 'initial',
    gridColumnStart: 3,
    gridColumnEnd: 4,
  },
}));

const Skeleton = styled(PiwiSkeleton)(({ theme }) => ({
  '&:not(:last-child)': {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));
