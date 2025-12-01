import { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  Paper as MuiPaper,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import PendingIcon from '@mui/icons-material/Pending';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAppSelector } from '@/store/hooks';
import Skeleton from '@/src/Components/Skeleton';
import { useMetrics } from './hooks';

export default function Sidebar() {
  const { t } = useTranslation();
  const dolar = useAppSelector((state) => state.currencies.dolar);
  const {
    dayIncome,
    weekIncome,
    monthIncome,
    yearIncome,
    pendingIncome,
    day_expenses,
    week_expenses,
    month_expenses,
    year_expenses,
    to_pay,
  } = useMetrics();
  const [index, setIndex] = useState(0);

  return (
    <Paper>
      <List subheader={<ListSubheader>{t('Metrics')}</ListSubheader>}>
        <ListItemButton onClick={() => setIndex(0)}>
          <ListItemText primary={t('Income')} />
          {index === 0 ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={index === 0} timeout="auto" unmountOnExit>
          <GridList dense disablePadding>
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
                  secondary={`${weekIncome.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })} (${(weekIncome * dolar).toLocaleString('es-VE', {
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
                  primary={t('Month income')}
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
                <EventRepeatIcon />
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
          </GridList>
        </Collapse>
        <ListItemButton onClick={() => setIndex(1)}>
          <ListItemText primary={t('Expenses')} />
          {index === 1 ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={index === 1} timeout="auto" unmountOnExit>
          <GridList dense disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <TodayIcon />
              </ListItemIcon>
              <MetricsSkeleton>
                <ListItemText
                  primary={t('Today expenses')}
                  secondary={`${day_expenses.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })} (${(day_expenses * dolar).toLocaleString('es-VE', {
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
                  primary={t('Week expenses')}
                  secondary={`${week_expenses.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })} (${(week_expenses * dolar).toLocaleString('es-VE', {
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
                  primary={t('Month expenses')}
                  secondary={`${month_expenses.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })} (${(month_expenses * dolar).toLocaleString('es-VE', {
                    style: 'currency',
                    currency: 'VES',
                  })})`}
                />
              </MetricsSkeleton>
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <EventRepeatIcon />
              </ListItemIcon>
              <MetricsSkeleton>
                <ListItemText
                  primary={t('Year expenses')}
                  secondary={`${year_expenses.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })} (${(year_expenses * dolar).toLocaleString('es-VE', {
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
                  primary={t('Debts')}
                  secondary={`${to_pay.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })} (${(to_pay * dolar).toLocaleString('es-VE', {
                    style: 'currency',
                    currency: 'VES',
                  })})`}
                />
              </MetricsSkeleton>
            </ListItemButton>
          </GridList>
        </Collapse>
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

const GridList = styled(List)(({ theme }) => ({
  [`${theme.breakpoints.between('sm', 'md')}`]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
}));

const MetricsSkeleton = styled(Skeleton)({
  maxWidth: '100%',
  flex: '1 1 auto',
  display: 'flex',
});
