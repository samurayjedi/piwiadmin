import { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import { Link, router } from '@inertiajs/react';
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
  Button,
  Fab,
} from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConfirmDialog from '@/src/lib/piwi/core/ConfirmDialog';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import { usePaginatorProps } from '@/hooks';
import IconButtonDropdown from '@/src/lib/piwi/core/IconButtonDropdown';
import Actions from '@/src/Components/Actions';
import { useAppSelector } from '@/store/hooks';
import SearchProducts from '@/src/Components/SearchProducts';
import { getMeasurementSuffix, useProducts } from './hooks';
import ProductFormDialog, { ProductFormDialogProps } from './ProductFormDialog';
import WholesaleInfoDialog from './WholesaleInfoDialog';
import { Product } from './types';

export default function Inventory() {
  const { t } = useTranslation();
  const products = useProducts();
  const sync = useAppSelector((state) => state.app.sync);
  const { count, page, rows } = usePaginatorProps();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const handleDialogClose = useCallback<
    NonNullable<ProductFormDialogProps['onClose']>
  >((e, r) => {
    switch (r) {
      case 'backdropClick':
      case 'escapeKeyDown':
        return;
    }

    setOpen(false);
    setId(0);
  }, []);

  return (
    <>
      <AppLayout>
        <SearchProducts
          variant="outlined"
          onSubmit={(ps) =>
            router.visit(route('inventory', { ids: ps.map((p) => p.id) }))
          }
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Barcode')}</TableCell>
                <TableCell>{t('Name')}</TableCell>
                <TableCell>{t('Price')}</TableCell>
                <TableCell>{t('Profit')}</TableCell>
                <TableCell>{t('Stock')}</TableCell>
                <TableCell>{t('Category')}</TableCell>
                <TableCell>{t('Brand')}</TableCell>
                <TableCell>{t('Wholesale')}</TableCell>
                <TableCell style={{ minWidth: '120px' }}>
                  {t('Actions')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!products.length ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    {t('No records found!')}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={`row-product-${p.id}`}>
                    <TableCell>{p.barcode}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      <LabelDolarBs value={p.price} />
                    </TableCell>
                    <TableCell>{p.profit}%</TableCell>
                    <TableCell>
                      <Button
                        LinkComponent={Link}
                        href={route('stock.manage.edit', { id: p.id })}
                      >
                        {p.stock}&nbsp;
                        {getMeasurementSuffix(p.measurement, p.stock)}
                      </Button>
                    </TableCell>
                    <TableCell>{p.category.category_label}</TableCell>
                    <TableCell>{p.brand.brand_label}</TableCell>
                    <TableCell>
                      {!p.wholesale ? (
                        t('No')
                      ) : (
                        <Button variant="text" onClick={() => setProduct(p)}>
                          {t('Yes')}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButtonDropdown
                        icon={<MoreVertIcon />}
                        disabled={sync !== 'ok'}
                      >
                        <Actions
                          onEdit={() => {
                            setId(p.id);
                            setOpen(true);
                          }}
                          onDelete={() => {
                            setId(p.id);
                            setConfirm(true);
                          }}
                        />
                      </IconButtonDropdown>
                    </TableCell>
                  </TableRow>
                ))
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
                      route('inventory', {
                        page,
                        rows: parseInt(ev.target.value, 10),
                      }),
                    )
                  }
                  onPageChange={(ev, newPage) =>
                    router.get(route('inventory', { page: newPage, rows }))
                  }
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </AppLayout>
      <Fab
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: !open && !confirm ? 'flex' : 'none',
        }}
        disabled={sync !== 'ok'}
        color="success"
        onClick={() => setOpen(true)}
        title={t('New product')}
      >
        <AddIcon />
      </Fab>
      <ProductFormDialog open={open} id={id} onClose={handleDialogClose} />
      <ConfirmDialog
        open={confirm}
        title={t('Are you sure?')}
        message={t('This action cannot be undone.')}
        onCancel={() => {
          setConfirm(false);
          setId(0);
        }}
        onConfirm={() => {
          router.post(route('inventory.product.delete', { id }));
          setConfirm(false);
          setId(0);
        }}
      />
      <WholesaleInfoDialog
        product={product}
        onClose={() => setProduct(undefined)}
      />
    </>
  );
}

const Paper = styled(MUIPaper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));
