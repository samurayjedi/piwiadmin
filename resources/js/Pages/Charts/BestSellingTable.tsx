import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import {
  Typography,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableFooter,
  TablePagination,
  TableContainer,
  Box,
} from '@mui/material';
import { Gauge } from '@mui/x-charts/Gauge';
import { usePaginatorProps } from '@/hooks';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import { getMeasurementSuffix } from '../Inventory/hooks';
import { useBestSelling, useChartTunes } from './hooks';

export default function BestSellingTable() {
  const { t } = useTranslation();
  const { page, count, rows } = usePaginatorProps();
  const bestSelling = useBestSelling();
  const charTunesProps = useChartTunes();

  return (
    <>
      <Typography variant="h6">{t('Best-selling products')}</Typography>
      <Box sx={{ p: 1 }} />
      <TableContainer id="bestsellig-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('Product')}</TableCell>
              <TableCell>{t('Units selled')}</TableCell>
              <TableCell>{t('Total selled')}</TableCell>
              <TableCell>{t('Progress')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(bestSelling).length ? (
              _.map(bestSelling, (v) => (
                <TableRow key={`bestselling-table-row-${v.id}`}>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>
                    {`${v.total_units_sold} ${getMeasurementSuffix(v.measurement, v.total_units_sold)}`}
                  </TableCell>
                  <TableCell>
                    <LabelDolarBs value={v.total_revenue} />
                  </TableCell>
                  <TableCell>
                    <Gauge
                      width={60}
                      height={60}
                      value={Math.ceil(v.sold_percentage)}
                      text={({ value }) => `${value}%`}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="h6">{t('No records found!')}</Typography>
                </TableCell>
              </TableRow>
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
                    route('charts', {
                      ...charTunesProps,
                      page,
                      rows: parseInt(ev.target.value, 10),
                    }),
                    {},
                    {
                      onFinish: () => {
                        location.href = '#bestsellig-table';
                      },
                    },
                  )
                }
                onPageChange={(ev, newPage) =>
                  router.get(
                    route('charts', {
                      ...charTunesProps,
                      page: newPage,
                      rows,
                    }),
                    {},
                    {
                      onFinish: () => {
                        location.href = '#bestsellig-table';
                      },
                    },
                  )
                }
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
