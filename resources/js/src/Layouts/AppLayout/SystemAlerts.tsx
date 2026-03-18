import { useEffect, useState } from 'react';
import _ from 'lodash';
import { Snackbar, Alert } from '@mui/material';
import { useAppPage } from '@/hooks';

export default function SystemAlerts() {
  const { props } = useAppPage();
  const [open, setOpen] = useState(
    Boolean(_.get(props, 'errors.kernel_panic', null)),
  );

  useEffect(() => {
    setOpen(Boolean(_.get(props, 'errors.kernel_panic', null)));
  }, [props]);

  const handleClose = () => setOpen(false);

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="error"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {_.get(props, 'errors.kernel_panic', null) as any}
      </Alert>
    </Snackbar>
  );
}
