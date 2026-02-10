import { useState } from 'react';
import { Link } from '@inertiajs/react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/src/Layouts/AppLayout';
import {
  Paper as MUIPaper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Fab,
  IconButton,
  Alert,
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import Gap from '@/src/lib/piwi/common/Gap';
import { useErrors } from '@/hooks';
import PayDialog from './PayDialog';
import Filters from './Filters';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';
import SalesRows from './SalesRows';
import ConfirmVoidInvoice from './ConfirmVoidInvoice';

export default function Sales() {
  const { t } = useTranslation();
  const [fuckErrors] = useErrors();
  const alertOauthOpen = Boolean(fuckErrors.kernel_panic);

  return (
    <>
      <AppLayout breadcrumbs={<Breadcrumbs />}>
        {alertOauthOpen && (
          <>
            <Alert severity="error">{fuckErrors.kernel_panic}</Alert>
            <Gap spacing={1} />
          </>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell sx={{ width: 200 }}>{t('Date')}</TableCell>
                <TableCell>{t('Client')}</TableCell>
                <TableCell>{t('Seller')}</TableCell>
                <TableCell>{t('Type')}</TableCell>
                <TableCell>{t('Total')}</TableCell>
                <TableCell>{t('To pay')}</TableCell>
                <TableCell>{t('Status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <SalesRows />
            </TableBody>
            <Footer />
          </Table>
        </TableContainer>
      </AppLayout>
      <Fab
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        variant="extended"
        color="success"
        LinkComponent={Link}
        href={route('sales.new_sale')}
      >
        <ShoppingCartCheckoutIcon />
        {t('New sale')}
      </Fab>
      <PayDialog />
      <ConfirmVoidInvoice />
    </>
  );
}

function Footer() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={6}>
          <FiltersContainer>
            <IconButton
              size="small"
              onClick={() => setFiltersOpen((prev) => !prev)}
            >
              {filtersOpen ? <CloseIcon /> : <FilterAltIcon />}
            </IconButton>
            <Filters open={filtersOpen} onClose={() => setFiltersOpen(false)} />
          </FiltersContainer>
        </TableCell>
        <Pagination colSpan={2} />
      </TableRow>
    </TableFooter>
  );
}

const Paper = styled(MUIPaper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const FiltersContainer = styled.div({
  display: 'flex',
  flexFlow: 'row',
  alignItems: 'center',
  overflow: 'hidden',
});
