import { Collapse, Alert } from '@mui/material';
import { useErrors } from '@/hooks';
import Gap from '@/src/lib/piwi/common/Gap';

export default function SaleAlerts() {
  const [fuckErrors] = useErrors();
  const alertOauthOpen = Boolean(fuckErrors.kernel_panic);

  return (
    <Collapse in={alertOauthOpen}>
      {alertOauthOpen && (
        <Alert severity="error">{fuckErrors.kernel_panic}</Alert>
      )}
      <Gap spacing={1} />
    </Collapse>
  );
}
