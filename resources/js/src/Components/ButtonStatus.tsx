import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@mui/material';

export default function ButtonStatus({ status, ...props }: ButtonStatusProps) {
  const { t } = useTranslation();

  return (
    <Button
      {...props}
      color={(() => {
        switch (status) {
          case 'canceled':
            return 'error';
          case 'completed':
            return 'success';
        }

        return 'warning';
      })()}
    >
      {t(status)}
    </Button>
  );
}

interface ButtonStatusProps extends Omit<ButtonProps, 'color' | 'children'> {
  status: 'canceled' | 'completed' | 'pending';
}
