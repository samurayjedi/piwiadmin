import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Alert, Collapse } from '@mui/material';

export default function StatusAlert() {
  const { status } = usePage().props;
  const [open, setOpen] = useState(Boolean(status));

  useEffect(() => setOpen(Boolean(status)), [status]);

  return (
    <Collapse in={open}>
      <Alert onClose={() => setOpen(false)}>{status as string}</Alert>
    </Collapse>
  );
}
