import { useTranslation } from 'react-i18next';
import ConfirmDialog from '@/src/lib/piwi/core/ConfirmDialog';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clientAction, clientDeleteAction } from '@/store/client';

export default function ConfirmDeleteDialog() {
  const { t } = useTranslation();
  const id = useAppSelector((state) => state.client.id);
  const action = useAppSelector((state) => state.client.action);
  const dispatch = useAppDispatch();

  return (
    <ConfirmDialog
      open={id > 0 && action === 'delete'}
      title={t('Are you sure?')}
      message={t('This action cannot be undone.')}
      onCancel={() => dispatch(clientAction([-1, undefined]))}
      onConfirm={(disabled) =>
        dispatch(clientDeleteAction({ onFinish: () => disabled(false) }))
      }
    />
  );
}
