import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Link } from '@inertiajs/react';
import { Tooltip } from '@mui/material';
import { useAppSelector } from '@/store/hooks';

export default function Logo({ size = 80, href = '/' }: LogoProps) {
  const { t } = useTranslation();
  const sync = useAppSelector((state) => state.app.sync);

  return (
    <LogoLink href={sync === 'ok' ? href : '#'}>
      <Tooltip title={t('Home')}>
        <img
          src="/storage/images/logo.png"
          alt="logo.png"
          height={size}
          width={size}
          style={{ objectFit: 'cover' }}
        />
      </Tooltip>
    </LogoLink>
  );
}

export interface LogoProps {
  size?: number;
  href?: string;
}

const LogoLink = styled(Link)({
  color: 'white',
  textDecoration: 'none',
});
