import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import BuildIcon from '@mui/icons-material/Build';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function Dial() {
  const [dialOpen, setDialOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <SpeedDial
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      open={dialOpen}
      ariaLabel={t('Sale actions')}
      icon={<SpeedDialIcon icon={<InventoryIcon />} />}
      FabProps={{
        onClick: () => setDialOpen((prev) => !prev),
      }}
    >
      <SpeedDialAction
        icon={<BuildIcon />}
        tooltipOpen
        tooltipTitle={t('Adjust')}
        onClick={() => router.visit(route('stock.manage'))}
      />
      <SpeedDialAction
        icon={<LocalShippingIcon />}
        tooltipOpen
        tooltipTitle={t('Entry')}
        onClick={() => router.visit(route('stock.new_merchandise'))}
      />
    </SpeedDial>
  );
}
