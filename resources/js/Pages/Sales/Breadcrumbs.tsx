import { useTranslation } from 'react-i18next';
import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';
import { Link, LastItem } from '@/src/Layouts/AppLayout/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { useSaleFilters } from './hooks';

export default function Breadcrumbs() {
  const { t } = useTranslation();
  const { client_id, sale_type, client_name } = useSaleFilters();

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      <Link href="/">
        <Typography variant="body1">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {t('Home')}
        </Typography>
      </Link>
      <Link href={route('dashboard')}>
        <Typography>{t('Dashboard')}</Typography>
      </Link>
      <ConditionalLink
        href={route('sales')}
        cond={client_id !== -1 || sale_type !== 'all'}
      >
        <Typography>{t('Sales')}</Typography>
      </ConditionalLink>
      {client_id !== -1 && (
        <ConditionalLink
          href={route('sales.client', { client_id })}
          cond={sale_type !== 'all'}
        >
          <Typography>{client_name}</Typography>
        </ConditionalLink>
      )}
      {sale_type !== 'all' && (
        <LastItem>
          <Typography>{t(sale_type)}</Typography>
        </LastItem>
      )}
    </MuiBreadcrumbs>
  );
}

function ConditionalLink({ children, href, cond }: ConditionalLinkProps) {
  return cond ? (
    <Link href={href}>{children}</Link>
  ) : (
    <LastItem>{children}</LastItem>
  );
}

interface ConditionalLinkProps {
  children: React.ReactNode;
  href: string;
  cond: boolean;
}
