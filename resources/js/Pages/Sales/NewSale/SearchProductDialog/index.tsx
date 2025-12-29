import { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  Dialog as MUIDialog,
  DialogContent,
  useMediaQuery,
  IconButton,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchProducts, {
  SearchProductsFieldRef,
} from '@/src/Components/SearchProducts';
import Gap from '@/src/lib/piwi/common/Gap';
import { type Product } from '@/Pages/Inventory/types';
import { useAppSelector } from '@/store/hooks';
import { useHandler } from './hooks';
import ProductRow from './ProductRow';
import { FormCart } from '../types';

export default function SearchProductDialog({
  onAdd,
  onClose,
}: SearchProductDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sync = useAppSelector((state) => state.app.sync);
  const open = useAppSelector(
    (state) => state.new_sale.searchProductDialogOpen,
  );
  const [products, setP] = useState<Product[]>([]);
  const { formRef, handleAddProducts } = useHandler(onAdd, setP);
  const ref = useRef<SearchProductsFieldRef>(null);

  return (
    <Dialog open={open} fullScreen={isMobile} maxWidth="md" onClose={onClose}>
      <DialogContent>
        <Wrapper>
          <Header>
            <Typography variant="h6">{t('Add product')}</Typography>
            <Glue />
            <IconButton disabled={sync !== 'ok'} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Header>
          <SearchProducts ref={ref} onSubmit={setP} />
          <form ref={formRef}>
            {products.length > 0 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ minWidth: '120px' }}>
                        {t('Barcode')}
                      </TableCell>
                      <TableCell width="100%">{t('Name')}</TableCell>
                      <TableCell>{t('Price')}</TableCell>
                      <TableCell>{t('Stock')}</TableCell>
                      <TableCell style={{ minWidth: '190px' }}>
                        {t('Quantity')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((p, i) => (
                      <ProductRow
                        {...p}
                        key={`searched-product-${p.id}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddProducts();
                          }
                        }}
                        index={i}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Gap />
            <Actions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleAddProducts();
                  ref.current?.reset();
                  setTimeout(() => {
                    if (ref.current) {
                      ref.current.inputRef()?.focus();
                    }
                  }, 100);
                }}
                disabled={!(products.length > 0)}
                sx={{ mr: `4px` }}
              >
                {t('Add')}
              </Button>
              <Button
                color="success"
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => {
                  handleAddProducts();
                  if (onClose) {
                    onClose();
                  }
                }}
                disabled={!(products.length > 0)}
              >
                {t('Add and continue')}
              </Button>
            </Actions>
          </form>
        </Wrapper>
      </DialogContent>
    </Dialog>
  );
}

export interface SearchProductDialogProps {
  onClose?: () => void;
  onAdd: (cart: FormCart[]) => void;
}

const Dialog = styled(MUIDialog)({
  '& .MuiDialog-paper': {
    width: '100%',
  },
});

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  '& form': {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
});

const Header = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  paddingBottom: theme.spacing(2),
}));

const Glue = styled.span({
  flex: 1,
  display: 'block',
});

const Actions = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  justifyContent: 'flex-end',
});
