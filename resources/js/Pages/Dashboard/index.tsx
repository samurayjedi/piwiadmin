import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import { Link } from '@inertiajs/react';
import {
  Paper as MUIPaper,
  Button,
  ButtonProps,
  Skeleton as MUISkeleton,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import AppLayout from '@/src/Layouts/AppLayout';
import Section from '@/src/Components/Section';
import StatusAlert from '@/src/Components/StatusAlert';
import GroupIcon from '@mui/icons-material/Group';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { useAppSelector } from '@/store/hooks';
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
              <CardButton
                LinkComponent={Link}
                href={route('sales.new_sale')}
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
              >
                {t('New sale')}
              </CardButton>
              <CardButton
                LinkComponent={Link}
                href={route('sales')}
                variant="contained"
                startIcon={<ChecklistIcon />}
              >
                {t('Listado')}
              </CardButton>
            </Section>
            <Section title={t('Products')} direction="row">
              <CardButton
                LinkComponent={Link}
                href={route('inventory')}
                variant="contained"
                startIcon={<InventoryIcon />}
              >
                {t('Inventory')}
              </CardButton>
              <CardButton
                LinkComponent={Link}
                href={route('categories')}
                variant="contained"
                startIcon={<CategoryIcon />}
              >
                {t('Categories')}
              </CardButton>
              <CardButton
                LinkComponent={Link}
                href={route('brands')}
                variant="contained"
                startIcon={<LocalOfferIcon />}
              >
                {t('Brands')}
              </CardButton>
            </Section>
            <Section title={t('Clients & Payments')} direction="row">
              <CardButton
                LinkComponent={Link}
                href={route('clients')}
                variant="contained"
                startIcon={<GroupIcon />}
              >
                {t('Clients')}
              </CardButton>
              <CardButton
                LinkComponent={Link}
                href={route('payment_methods')}
                variant="contained"
                startIcon={<CreditCardIcon />}
              >
                {t('Payments methods')}
              </CardButton>
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

const StyledCardButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: 155,
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

function CardButton(props: ButtonProps) {
  const sync = useAppSelector((state) => state.app.sync);

  if (sync === 'ok') {
    return <StyledCardButton {...props} />;
  }

  return (
    <Skeleton variant="rounded">
      <StyledCardButton {...props} />
    </Skeleton>
  );
}

const Skeleton = styled(MUISkeleton)(({ theme }) => ({
  '&:not(:last-child)': {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const PiwiContainer = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `0.8fr ${theme.spacing(1)} 3fr`,
  gridTemplateRows: 'min-content',
}));

const SidebarContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Content = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gridColumnStart: 3,
  gridColumnEnd: 4,
});
