import { FormSpy } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { Fab } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clientAction } from '@/store/client';

export default function NewClientFab() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const id = useAppSelector((state) => state.client.id);

  return (
    <FormSpy
      subscription={{ submitting: true }}
      render={({ submitting }) => (
        <Fab
          title={t('New client')}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: id !== 0 ? 'flex' : 'none',
          }}
          disabled={submitting}
          color="success"
          onClick={() => dispatch(clientAction([0, 'add']))}
        >
          <PersonAddIcon />
        </Fab>
      )}
    />
  );
}
