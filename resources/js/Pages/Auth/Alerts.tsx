import { Collapse, Alert } from '@mui/material';
import { useErrors } from '@/hooks';

export default function Alerts({
  status,
  noMargin = false,
}: {
  status: string;
  noMargin?: boolean;
}) {
  const [fuckErrors] = useErrors();
  const alertStatusOpen = Boolean(status);
  const alertOauthOpen = Boolean(fuckErrors.kernel_panic);
  const collapse = alertStatusOpen || alertOauthOpen;

  return (
    <Collapse in={collapse} sx={!noMargin && collapse ? { mt: -2 } : {}}>
      {alertStatusOpen && <Alert severity="success">{status}</Alert>}
      {alertOauthOpen && (
        <Alert severity="error">{fuckErrors.kernel_panic}</Alert>
      )}
      {!noMargin && <div className="spacing" />}
    </Collapse>
  );
}
