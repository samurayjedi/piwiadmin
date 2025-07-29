import { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import { router } from '@inertiajs/react';
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
  IconButton,
  Button,
} from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from '@/src/lib/piwi/core/ConfirmDialog';
import { usePaginatorProps } from '@/hooks';
import { useProducts } from './hooks';
import ProductFormDialog, { ProductFormDialogProps } from './ProductFormDialog';
import WholesaleInfoDialog from './WholesaleInfoDialog';

export default function Inventory() {
  const { t } = useTranslation();
  const products = useProducts();
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
        <Container maxWidth="lg">
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
                      <TableCell>${p.price}</TableCell>
                      <TableCell>{p.profit}%</TableCell>
                      <TableCell>{p.stock}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>{p.brand}</TableCell>
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
                        <IconButton
                          onClick={() => {
                            setId(p.id);
                            setOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setId(p.id);
                            setConfirm(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <AddNewButton
                      variant="text"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => setOpen(true)}
                    >
                      {t('Add new')}
                    </AddNewButton>
                  </TableCell>
                </TableRow>
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
        </Container>
      </AppLayout>
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

const AddNewButton = styled(Button)({
  display: 'flex',
  width: '100%',
});
