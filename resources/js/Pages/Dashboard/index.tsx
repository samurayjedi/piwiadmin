import { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import { Link, router } from '@inertiajs/react';
import { Paper as MUIPaper, Button } from '@mui/material';
import BlindsClosedIcon from '@mui/icons-material/BlindsClosed';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import AppLayout from '@/src/Layouts/AppLayout';
import Section from '@/src/Components/Section';
import GroupIcon from '@mui/icons-material/Group';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PaymentsIcon from '@mui/icons-material/Payments';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import BarChartIcon from '@mui/icons-material/BarChart';
import WalletIcon from '@mui/icons-material/Wallet';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PiwiSkeleton from '@/src/Components/Skeleton';
import Sidebar from './Sidebar';
import PaydeskConfirmDialog from './PaydeskConfirmDialog';
import { usePaydesk } from '../Paydesk/hooks';

export default function Dashboard() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const paydesk = usePaydesk();

  return (
    <>
      <AppLayout>
        <PiwiContainer>
          <SidebarContainer>
            <Sidebar />
          </SidebarContainer>
          <Content>
            <Paper>
              <Section title={t('Sales')} direction="row">
                <Skeleton variant="rounded">
                  <CardButton
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => {
                      if (
                        (paydesk.session && paydesk.session.user_id) ||
                        !paydesk.petty_cash_funds.length
                      ) {
                        router.visit(route('sales.new_sale'));
                      } else {
                        setOpen(true);
                      }
                    }}
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
                <Skeleton variant="rounded">
                  <CardButton
                    LinkComponent={Link}
                    href={route('cut_paydesk')}
                    variant="contained"
                    startIcon={<ContentCutIcon />}
                  >
                    {t('Cut')}
                  </CardButton>
                </Skeleton>
                <Skeleton variant="rounded">
                  <CardButton
                    LinkComponent={Link}
                    href={route('close_paydesk')}
                    variant="contained"
                    startIcon={<BlindsClosedIcon />}
                  >
                    {t('Closure')}
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
                <Skeleton variant="rounded">
                  <CardButton
                    LinkComponent={Link}
                    href={route('payable_accounts')}
                    variant="contained"
                    startIcon={<WalletIcon />}
                  >
                    {t('Payable accounts')}
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
      <PaydeskConfirmDialog open={open} onClose={() => setOpen(false)} />
    </>
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
  marginLeft: theme.spacing(2),
  '&:not(:last-child)': {
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
  marginLeft: theme.spacing(2),
  '&:not(:last-child)': {
    marginBottom: theme.spacing(2),
  },
  '& > :first-child': {
    marginLeft: 0,
    marginBottom: 0,
  },
}));
