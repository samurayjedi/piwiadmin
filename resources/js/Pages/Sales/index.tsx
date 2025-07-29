import { useCallback, useState } from 'react';
import { router } from '@inertiajs/react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/src/Layouts/AppLayout';
import {
  Container,
  Paper as MUIPaper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  Button,
  IconButton,
} from '@mui/material';
import SoapIcon from '@mui/icons-material/Soap';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import { usePaginatorProps } from '@/hooks';
import { useSales } from './hooks';
import ClientInfoDialog from './ClientInfoDialog';
import UserInfo from './UserInfo';
import ItemsDialog from './ItemsDialog';
import SaleTableRow from './SaleTableRow';
import PayDialog from './PayDialog';

export default function Sales() {
  const { t } = useTranslation();
  const { page, count, rows } = usePaginatorProps();
  const sales = useSales();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [items, setItems] = useState<
    (typeof sales)[number]['sale_items'] | undefined
  >(undefined);
  const [s, setS] = useState<(typeof sales)[number] | undefined>(undefined);

  const handleClientDialogClose = useCallback(() => {
    setClient(undefined);
  }, []);

  const handleItemsDialogClose = useCallback(() => {
    setItems(undefined);
  }, []);

  return (
    <>
      <AppLayout>
        <Container maxWidth="lg">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Date')}</TableCell>
                  <TableCell align="center">{t('Client')}</TableCell>
                  <TableCell>{t('Seller')}</TableCell>
                  <TableCell>{t('Type')}</TableCell>
                  <TableCell align="center">{t('Purchases')}</TableCell>
                  <TableCell>{t('Total')}</TableCell>
                  <TableCell>{t('Payed')}</TableCell>
                  <TableCell>{t('Status')}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.length > 0 ? (
                  <>
                    {sales.map((sale) => (
                      <SaleTableRow
                        key={`sale-row-${sale.id}`}
                        data-notes={sale.notes ?? false}
                      >
                        <TableCell>{sale.created_at}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="text"
                            size="small"
                            color="primary"
                            onClick={() => setClient(sale.client)}
                          >
                            {sale.client.name}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <UserInfo user={sale.user} />
                        </TableCell>
                        <TableCell>{sale.payment_type}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => setItems(sale.sale_items)}
                          >
                            x
                            {(() => {
                              let purchases = 0;
                              sale.sale_items.forEach((sale_item) => {
                                purchases += sale_item.quantity;
                              });

                              return purchases;
                            })()}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <LabelDolarBs value={sale.total_amount} />
                        </TableCell>
                        <TableCell>
                          <LabelDolarBs value={sale.amount_paid} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color={(() => {
                              switch (sale.status) {
                                case 'canceled':
                                  return 'error';
                                case 'completed':
                                  return 'success';
                              }

                              return 'warning';
                            })()}
                          >
                            {sale.status}
                          </Button>
                        </TableCell>
                        <TableCell>
                          {sale.payment_type !== 'cash' && (
                            <IconButton
                              title={t('Pay')}
                              onClick={() => setS(sale)}
                            >
                              <SoapIcon />
                            </IconButton>
                          )}
                          <IconButton title={t('Receipt')}>
                            <ReceiptIcon />
                          </IconButton>
                        </TableCell>
                      </SaleTableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      {t('No records found!')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]} // , { label: t('All'), value: -1 }
                    colSpan={9}
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
        </Container>
      </AppLayout>
      <ClientInfoDialog client={client} onClose={handleClientDialogClose} />
      <ItemsDialog onClose={handleItemsDialogClose} sale_items={items} />
      <PayDialog sale={s} onClose={() => setS(undefined)} />
    </>
  );
}

const Paper = styled(MUIPaper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));
