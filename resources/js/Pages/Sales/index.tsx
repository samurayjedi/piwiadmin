import { useCallback, useState } from 'react';
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
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import CollapsibleRows from '@/src/lib/piwi/animated/CollapsibleRows';
import { useSales } from './hooks';
import ItemsDialog from './ItemsDialog';
import PayDialog from './PayDialog';
import PaymentsMadeDialog from './PaymentsMadeDialog';
import Filters from './Filters';
import TableCellsSale from './TableCellsSale';
import TableCellsSaleDetails from './TableCellsSaleDetails';
import Breadcrumbs from './Breadcrumbs';
import Pagination from './Pagination';

export default function Sales() {
  const { t } = useTranslation();
  const sales = useSales();
  const [items, setItems] = useState<
    (typeof sales)[number]['sale_items'] | undefined
  >(undefined);
  const [s, setS] = useState<(typeof sales)[number] | undefined>(undefined);
  const [s2, setS2] = useState<(typeof sales)[number] | undefined>(undefined);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleItemsDialogClose = useCallback(() => {
    setItems(undefined);
  }, []);

  return (
    <>
      <AppLayout breadcrumbs={<Breadcrumbs />}>
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
                <CollapsibleRows colSpan={8}>
                  {(activeIndex, setActiveIndex) =>
                    sales.map((sale, index) => [
                      <TableCellsSale
                        {...sale}
                        active={activeIndex === index}
                        onRequestCollapse={() =>
                          setActiveIndex((prev) => {
                            if (prev === index) {
                              return -1;
                            }

                            return index;
                          })
                        }
                      />,
                      <TableCellsSaleDetails
                        {...sale}
                        onPay={(cSale) => setS(cSale)}
                      />,
                    ])
                  }
                </CollapsibleRows>
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
                <Pagination colSpan={2} />
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
