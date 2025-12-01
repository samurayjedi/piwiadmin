import { useCallback } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  useMediaQuery,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FormProps } from 'react-final-form';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSync } from '@/store/app';
import { useAppPage } from '@/hooks';
import Gap from '@/src/lib/piwi/common/Gap';
import ProductForm from './ProductForm';

export default function ProductFormDialog({
  open,
  id,
  onClose,
}: ProductFormDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const sync = useAppSelector((state) => state.app.sync);
  const {
    props: { errors },
  } = useAppPage();

  const handleSubmitForm = useCallback<FormProps['onSubmit']>(
    (data, form) => {
      const url = !id
        ? route('inventory.product.add')
        : route('inventory.product.update.submit', { id });

      return new Promise<void>((resolve) => {
        router.post(url, data, {
          preserveScroll: true,
          onBefore: () => {
            dispatch(setSync('loading'));
          },
          onFinish: () => {
            dispatch(setSync('ok'));
            resolve();
          },
          onSuccess: () => {
            form.reset();
            if (onClose) {
              onClose();
            }
          },
        });
      });
    },
    [id, onClose],
  );

  return (
    <Dialog open={open} fullScreen={isMobile} maxWidth="md" onClose={onClose}>
      <DialogContent>
        <Wrapper>
          <Header>
            <Typography variant="h6">{t('Add product')}</Typography>
            <Glue />
            <IconButton onClick={onClose} disabled={sync !== 'ok'}>
              <CloseIcon />
            </IconButton>
          </Header>
          {Object.hasOwnProperty.call(errors, 'kernel_panic') && (
            <>
              <Alert severity="error">{errors.kernel_panic}</Alert>
              <Gap />
            </>
          )}
          <ProductForm id={id} onSubmit={handleSubmitForm} />
        </Wrapper>
      </DialogContent>
    </Dialog>
  );
}

export interface ProductFormDialogProps {
  open: boolean;
  id?: number;
  onClose?: (e?: object, r?: 'backdropClick' | 'escapeKeyDown') => void;
}

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Header = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  paddingBottom: theme.spacing(1),
}));

const Glue = styled.span({
  flex: 1,
  display: 'block',
});
