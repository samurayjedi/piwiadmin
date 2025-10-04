import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  Paper as MuiPaper,
  List as MuiList,
  ListSubheader as MuiListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PendingIcon from '@mui/icons-material/Pending';
import { useAppSelector } from '@/store/hooks';
import Skeleton from '@/src/Components/Skeleton';
import { useMetrics } from './hooks';

export default function Sidebar() {
  const { t } = useTranslation();
  const dolar = useAppSelector((state) => state.currencies.dolar);
  const { dayIncome, monthIncome, yearIncome, pendingIncome } = useMetrics();

  return (
    <Paper>
      <List subheader={<ListSubheader>{t('Metrics')}</ListSubheader>}>
        <ListItemButton>
          <ListItemIcon>
            <TodayIcon />
          </ListItemIcon>
          <MetricsSkeleton>
            <ListItemText
              primary={t('Today income')}
              secondary={`${dayIncome.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })} (${(dayIncome * dolar).toLocaleString('es-VE', {
                style: 'currency',
                currency: 'VES',
              })})`}
            />
          </MetricsSkeleton>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <DateRangeIcon />
          </ListItemIcon>
          <MetricsSkeleton>
            <ListItemText
              primary={t('Week income')}
              secondary={`${monthIncome.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })} (${(monthIncome * dolar).toLocaleString('es-VE', {
                style: 'currency',
                currency: 'VES',
              })})`}
            />
          </MetricsSkeleton>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <CalendarMonthIcon />
          </ListItemIcon>
          <MetricsSkeleton>
            <ListItemText
              primary={t('Year income')}
              secondary={`${yearIncome.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })} (${(yearIncome * dolar).toLocaleString('es-VE', {
                style: 'currency',
                currency: 'VES',
              })})`}
            />
          </MetricsSkeleton>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <PendingIcon />
          </ListItemIcon>
          <MetricsSkeleton>
            <ListItemText
              primary={t('Pending income')}
              secondary={`${pendingIncome.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })} (${(pendingIncome * dolar).toLocaleString('es-VE', {
                style: 'currency',
                currency: 'VES',
              })})`}
            />
          </MetricsSkeleton>
        </ListItemButton>
      </List>
    </Paper>
  );
}

const Paper = styled(MuiPaper)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.grey[100],
  borderColor: theme.palette.grey[300],
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 0,
}));

const List = styled(MuiList)(({ theme }) => ({
  [`${theme.breakpoints.between('sm', 'md')}`]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
}));

const ListSubheader = styled(MuiListSubheader)(({ theme }) => ({
  [`${theme.breakpoints.between('sm', 'md')}`]: {
    gridColumnStart: 1,
    gridColumnEnd: 3,
  },
}));

const MetricsSkeleton = styled(Skeleton)({
  maxWidth: '100%',
  flex: '1 1 auto',
  display: 'flex',
});
