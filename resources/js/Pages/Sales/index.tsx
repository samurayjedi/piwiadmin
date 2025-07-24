import { useCallback, useState, useMemo } from 'react';
import _ from 'lodash';
import { router, usePage } from '@inertiajs/react';
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
  Popover,
  Typography,
  IconButton,
} from '@mui/material';
import SoapIcon from '@mui/icons-material/Soap';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import { useSales } from './hooks';
import { Client } from '../Clients';
import ClientInfoDialog from './ClientInfoDialog';
import UserInfo from './UserInfo';
import { Cart } from './NewSale/SearchProductDialog';
import ItemsDialog from './ItemsDialog';

export default function Sales() {
  const { page, count, rows } = usePage().props;
  const { t } = useTranslation();
  const sales = useSales();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [items, setItems] = useState<Cart[] | undefined>(undefined);
  const popoverId = useMemo(() => _.uniqueId('popover-sale-note_'), []);
  const [noteAnchor, setNoteAnchor] = useState<HTMLElement | null>(null);

  const handleClientDialogClose = useCallback(() => {
    setClient(undefined);
  }, []);

  const handleItemsDialogClose = useCallback(() => {
    setItems(undefined);
  }, []);

  const handlePopoverOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const notes = event.currentTarget.getAttribute('data-notes');
      if (notes !== 'false') {
        setNoteAnchor(event.currentTarget);
      }
    },
    [],
  );

  const handlePopoverClose = useCallback(() => {
    setNoteAnchor(null);
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
                  <TableCell>{t('Tax')}</TableCell>
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
                      <TableRow
                        key={`sale-row-${sale.id}`}
                        data-notes={sale.notes ?? false}
                        aria-owns={noteAnchor !== null ? popoverId : undefined}
                        aria-haspopup="true"
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
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
                            onClick={() =>
                              setItems(
                                sale.sale_items.map((item) => ({
                                  ...item.product,
                                  qty: item.quantity,
                                })),
                              )
                            }
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
                          <LabelDolarBs value={sale.tax_amount} />
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
                            <IconButton title={t('Pay')}>
                              <SoapIcon />
                            </IconButton>
                          )}
                          <IconButton title={t('Receipt')}>
                            <ReceiptIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
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
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]} // , { label: t('All'), value: -1 }
                    colSpan={12}
                    rowsPerPage={rows as number}
                    page={page as number}
                    count={count as number}
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
      <ItemsDialog onClose={handleItemsDialogClose} items={items} />
      <Popover
        id={popoverId}
        sx={{ pointerEvents: 'none' }}
        open={noteAnchor !== null}
        anchorEl={noteAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }} variant="subtitle1">
          {noteAnchor?.getAttribute('data-notes')}
        </Typography>
      </Popover>
    </>
  );
}

const Paper = styled(MUIPaper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));
