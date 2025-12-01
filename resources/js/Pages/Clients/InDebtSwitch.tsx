import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { FormControlLabel, Switch } from '@mui/material';
import { useFilters } from './hooks';

export default function InDetbSwitch() {
  const { t } = useTranslation();
  const { in_debt, ids } = useFilters();
  const [disabled, setDisabled] = useState(false);

  return (
    <FormControlLabel
      control={
        <Switch
          disabled={disabled}
          defaultChecked={in_debt === 1}
          color="warning"
          onChange={(ev) => {
            if (ev.target.checked) {
              router.visit(route('clients', { in_debt: true, ids }), {
                preserveState: true,
                onBefore: () => setDisabled(true),
                onFinish: () => setDisabled(false),
              });
            } else {
              router.visit(route('clients', { in_debt: false, ids }), {
                preserveState: true,
                onBefore: () => setDisabled(true),
                onFinish: () => setDisabled(false),
              });
            }
          }}
        />
      }
      label={t('In debt')}
    />
  );
}
