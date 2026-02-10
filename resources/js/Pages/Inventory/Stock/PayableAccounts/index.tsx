import { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
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
} from '@mui/material';
import { usePaginatorProps } from '@/hooks';
import AppLayout from '@/src/Layouts/AppLayout';
import AccountsRows from './AccountsRows';
import usePayableAccounts from './hooks';
import PayDialog from './PayDialog';

export default function Stock() {
  const { t } = useTranslation();
  const { page, rows, count } = usePaginatorProps();
  const payable_accounts = usePayableAccounts();
  const [id, setId] = useState(-1);

  const onPay = useCallback((id_selected: number) => setId(id_selected), []);

  return (
    <>
      <AppLayout>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>{t('Description')}</TableCell>
                <TableCell>{t('Total')}</TableCell>
                <TableCell>{t('Amount paid')}</TableCell>
                <TableCell>{t('Created at')}</TableCell>
                <TableCell>{t('Due date')}</TableCell>
                <TableCell>{t('Status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!payable_accounts.length ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t('No records found!')}
                  </TableCell>
                </TableRow>
              ) : (
                <AccountsRows onPay={onPay} />
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]} // , { label: t('All'), value: -1 }
                  colSpan={12}
                  page={page}
                  count={count}
                  rowsPerPage={rows}
                  onRowsPerPageChange={(ev) =>
                    router.get(
                      route('inventory.stock.payable_accounts', {
                        page,
                        rows: parseInt(ev.target.value, 10),
                      }),
                    )
                  }
                  onPageChange={(ev, newPage) =>
                    router.get(
                      route('inventory.stock.payable_accounts', {
                        page: newPage,
                        rows,
                      }),
                    )
                  }
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </AppLayout>
      <PayDialog id={id} onClose={() => setId(-1)} />
    </>
  );
}

const Paper = styled(MUIPaper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));
