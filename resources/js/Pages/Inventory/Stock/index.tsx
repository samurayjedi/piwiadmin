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
import CollapsibleRows from '@/src/lib/piwi/animated/CollapsibleRows';
import { useLogs } from './hooks';
import LogCells from './LogCells';
import LogDetails from './LogDetails';
import Dial from './Dial';

export default function Stock() {
  const { t } = useTranslation();
  const { page, rows, count } = usePaginatorProps();
  const logs = useLogs();

  return (
    <>
      <AppLayout>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>{t('Description')}</TableCell>
                <TableCell>{t('Date')}</TableCell>
                <TableCell>{t('Adjustment type')}</TableCell>
                <TableCell>{t('Reason')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!logs.length ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('No records found!')}
                  </TableCell>
                </TableRow>
              ) : (
                <CollapsibleRows colSpan={5}>
                  {(activeIndex, setActiveIndex) =>
                    logs.map((log, i) => [
                      <LogCells
                        {...log}
                        active={activeIndex === i}
                        onRequestCollapse={() =>
                          setActiveIndex((prev) => {
                            if (prev === i) {
                              return -1;
                            }

                            return i;
                          })
                        }
                      />,
                      <LogDetails {...log} />,
                    ])
                  }
                </CollapsibleRows>
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
                      route('stock', {
                        page,
                        rows: parseInt(ev.target.value, 10),
                      }),
                    )
                  }
                  onPageChange={(ev, newPage) =>
                    router.get(route('stock', { page: newPage, rows }))
                  }
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </AppLayout>
      <Dial />
    </>
  );
}

const Paper = styled(MUIPaper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));
