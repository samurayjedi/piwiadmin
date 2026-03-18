import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '@/src/lib/piwi/core/ConfirmDialog';
import { useInitialFunds } from '../Paydesk/hooks';

export default function PaydeskConfirmDialog({
  open,
  onClose,
}: PaydeskConfirmDialogProps) {
  const { t } = useTranslation();
  const initialFunds = useInitialFunds();

  return (
    <ConfirmDialog
      open={open}
      title={t('Opening paydesk.')}
      onCancel={onClose}
      onConfirm={(setDisabled) =>
        router.visit(route('sales.new_sale'), {
          onBefore: () => setDisabled(true),
        })
      }
    >
      <p>
        {t(
          'Check if the following initial amounts are correct before proceed to open the paydesks:',
        )}
      </p>
      {initialFunds.map((p) => (
        <p
          key={`fund-${p.payment_method_id}`}
        >{`${p.payment_method.payment_label}: ${
          p.payment_method.payment_currency === '$'
            ? p.amount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })
            : p.amount.toLocaleString('es-VE', {
                style: 'currency',
                currency: 'VES',
              })
        }`}</p>
      ))}
    </ConfirmDialog>
  );
}

export interface PaydeskConfirmDialogProps {
  open: boolean;
  onClose?: () => void;
}
