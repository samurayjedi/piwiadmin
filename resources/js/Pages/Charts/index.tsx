import React, { useState } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Typography, Paper as MUIPaper, Box, IconButton } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import AppLayout from '@/src/Layouts/AppLayout';
import { format, parse } from '@/src/lib/piwi/dateFnsFacade';
import BestSellingTable from './BestSellingTable';
import SalesChartConfigDialog from './SalesChartConfigDialog';
import SalesChart from './SalesChart';
import SalesScatterChart from './SalesScatterChart';
import { useChartTunes, useDataset } from './hooks';
import SalesPieChart from './SalesPieChart';

export default function Categories() {
  const { t } = useTranslation();
  const [tuneSalesChart, setTuneSalesChart] = useState(false);

  return (
    <>
      <AppLayout>
        <Paper>
          <Header>
            <Typography variant="h6">{t('Sales chart')}</Typography>
            <Box sx={{ flex: 1 }} />
            <IconButton onClick={() => setTuneSalesChart(true)}>
              <TuneIcon />
            </IconButton>
          </Header>
          <Chart />
          <Box sx={{ p: 1 }} />
          <BestSellingTable />
        </Paper>
      </AppLayout>
      <SalesChartConfigDialog
        open={tuneSalesChart}
        onClose={() => setTuneSalesChart(false)}
      />
    </>
  );
}

const Chart = React.memo(() => {
  const { t } = useTranslation();
  const { dataset } = useDataset();
  const { sales_chart_type, sales_date, sales_timeframe } = useChartTunes();
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  if (!dataset.length || (sales_chart_type === 'pie' && !_.size(dataset[0]))) {
    const date = parse(sales_date);
    const f = sales_timeframe === 'sales_by_day' ? 'MMMM yyyy' : 'yyyy';

    return (
      <NoData>
        <Typography variant="h6" color="textSecondary">
          📊
          {t('No data available for', {
            sales_date: format(date, f),
          })}
        </Typography>
      </NoData>
    );
  }

  return (
    <ChartContainer
      ref={(r) => {
        if (r !== ref) {
          setRef(r);
        }
      }}
      style={{ width: '100%' }}
    >
      {ref &&
        (() => {
          switch (sales_chart_type) {
            case 'bar':
            case 'line':
              return <SalesChart width={ref.offsetWidth} />;
            case 'scatter':
              return <SalesScatterChart />;
            case 'pie':
              return <SalesPieChart />;
          }

          throw new Error(`Invalid chart type ${sales_chart_type}`);
        })()}
    </ChartContainer>
  );
}, _.isEqual);

const Paper = styled(MUIPaper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
}));

const Header = styled.div({
  display: 'flex',
  width: '100%',
});

const ChartContainer = styled.div({
  flex: 1,
});

const NoData = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px dashed #ccc',
  borderRadius: '8px',
  backgroundColor: '#f5f5f5',
});
