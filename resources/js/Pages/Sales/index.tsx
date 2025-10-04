import { useCallback, useState } from 'react';
import { Link, router } from '@inertiajs/react';
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
  TablePagination,
  Fab,
  IconButton,
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import { usePaginatorProps } from '@/hooks';
import { useSales } from './hooks';
import ClientInfoDialog from './ClientInfoDialog';
import ItemsDialog from './ItemsDialog';
import SaleTableRow from './SaleTableRow';
import PayDialog from './PayDialog';
import PaymentsMadeDialog from './PaymentsMadeDialog';
import Filters from './Filters';

export default function Sales() {
  const { t } = useTranslation();
  const { page, count, rows } = usePaginatorProps();
  const sales = useSales();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [items, setItems] = useState<
    (typeof sales)[number]['sale_items'] | undefined
  >(undefined);
  const [s, setS] = useState<(typeof sales)[number] | undefined>(undefined);
  const [s2, setS2] = useState<(typeof sales)[number] | undefined>(undefined);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleClientDialogClose = useCallback(() => {
    setClient(undefined);
  }, []);

  const handleItemsDialogClose = useCallback(() => {
    setItems(undefined);
  }, []);

  return (
    <>
      <AppLayout>
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
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <SaleTableRow
                    {...sale}
                    onPay={() => setS(sale)}
                    onClientClick={() => setClient(sale.client)}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {t('No records found!')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
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
                    <Filters
                      open={filtersOpen}
                      onClose={() => setFiltersOpen(false)}
                    />
                  </FiltersContainer>
                </TableCell>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]} // , { label: t('All'), value: -1 }
                  colSpan={2}
                  rowsPerPage={rows}
                  page={page}
                  count={count}
                  onRowsPerPageChange={(ev) =>
                    router.get(
                      route('sales', {
                        page,
                        rows: parseInt(ev.target.value, 10),
                      }),
                    )
                  }
                  onPageChange={(ev, newPage) =>
                    router.get(route('sales', { page: newPage, rows }))
                  }
                />
              </TableRow>
            </TableFooter>
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
      <ClientInfoDialog client={client} onClose={handleClientDialogClose} />
      <ItemsDialog onClose={handleItemsDialogClose} sale_items={items} />
      <PayDialog sale={s} onClose={() => setS(undefined)} />
      <PaymentsMadeDialog sale={s2} onClose={() => setS2(undefined)} />
    </>
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
