import { useTranslation } from 'react-i18next';
import ConfirmDialog from '@/src/lib/piwi/core/ConfirmDialog';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { closeVoidInvoce, voidInvoiceAction } from '@/store/sales';

export default function ConfirmVoidInvoice() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.sales.void_invoice_dialog_open);

  return (
    <ConfirmDialog
      open={open}
      title={t('Are you sure?')}
      message={t('This action cannot be undone.')}
      onCancel={() => dispatch(closeVoidInvoce())}
      onConfirm={(disabled) =>
        dispatch(
          voidInvoiceAction({
            onBefore: () => disabled(true),
            onFinish: () => disabled(false),
          }),
        )
      }
    />
  );
}
