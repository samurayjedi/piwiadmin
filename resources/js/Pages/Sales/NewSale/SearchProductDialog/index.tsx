import { useMemo, useCallback } from 'react';
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
import Search from '@/src/lib/piwi/core/Search';
import { useAppSelector } from '@/store/hooks';
import { useRequestFocus, useHandler } from './hooks';
import ProductRow from './ProductRow';
import { Cart } from '../../types';

export default function SearchProductDialog({
  open,
  onClose,
  addAction,
}: SearchProductDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sync = useAppSelector((state) => state.app.sync);

  const retrieveRef = useRequestFocus(open, sync);
  const { products, formRef, handleSubmit, handleAddProducts } = useHandler(
    addAction,
    onClose,
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        handleAddProducts();
      }
    },
    [handleAddProducts],
  );

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
          <Search
            ref={retrieveRef}
            name="field"
            label={t('Search')}
            variant="filled"
            items={useMemo(
              () => ({ name: t('Name'), barcode: t('Barcode') }),
              [t],
            )}
            onSubmit={handleSubmit}
            disabled={sync !== 'ok'}
          />
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
                        onKeyDown={onKeyDown}
                        index={i}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <Gap />
            <Button
              sx={{ alignSelf: 'flex-end' }}
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddProducts}
              disabled={!(products.length > 0)}
            >
              {t('Add')}
            </Button>
          </form>
        </Wrapper>
      </DialogContent>
    </Dialog>
  );
}

export interface SearchProductDialogProps {
  open: boolean;
  onClose?: () => void;
  addAction: (p: Cart[]) => void;
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

const Gap = styled.div(({ theme }) => ({
  display: 'block',
  padding: theme.spacing(2),
}));
