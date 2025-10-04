import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AllSeriesType, AxisConfig, HighlightScope } from '@mui/x-charts';
import { useAppPage } from '@/hooks';
import { sell_types } from '@/consts';

export function useDataset() {
  const {
    props: { dataset, dataset_labels },
  } = useAppPage();
  if (!dataset || !dataset_labels) {
    throw new Error('Dataset are no available in this page!');
  }

  return { dataset, dataset_labels };
}

export function useChartTunes() {
  const {
    props: {
      sales_dataset,
      sales_timeframe,
      sales_date,
      sales_chart_type,
      sales_layout,
    },
  } = useAppPage();

  if (
    !sales_dataset ||
    !sales_timeframe ||
    !sales_date ||
    !sales_chart_type ||
    !sales_layout
  ) {
    throw new Error('Chart tunes are no available in this page!');
  }

  return {
    sales_dataset,
    sales_timeframe,
    sales_date,
    sales_chart_type,
    sales_layout,
  };
}

export function useBestSelling() {
  const {
    props: { bestSelling },
  } = useAppPage();
  if (!bestSelling) {
    throw new Error('Best selling products aren\t available in this page!');
  }

  return bestSelling;
}

export function useChartHeight() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const chartHeight = isMobile ? 250 : isTablet ? 350 : 450;

  return chartHeight;
}

export function useAxies() {
  const { t } = useTranslation();
  const { sales_timeframe } = useChartTunes();
  const timeline = useMemo(() => {
    switch (sales_timeframe) {
      case 'sales_by_day':
        return 'day';
      case 'sales_by_month':
        return 'month';
    }

    throw new Error(`Invalid sales chart ${sales_timeframe}`);
  }, [sales_timeframe]);

  const timelineAxis = useMemo<AxisConfig[]>(
    () => [
      {
        id: 'timeline-axis',
        dataKey: timeline,
        scaleType: 'band',
        hideTooltip: true,
      },
    ],
    [timeline],
  );

  const valueAxies = useMemo(() => {
    const arr: AxisConfig[] = [];
    arr.push({
      id: REVENUE_AXIS,
      scaleType: 'linear',
      valueFormatter: (value) =>
        `${value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}`,
    } as AxisConfig);
    /* arr.push({
      id: SALES_AXIS,
      position: 'right',
      label: t('Sales count'),
      scaleType: 'linear',
    } as AxisConfig); */

    return arr;
  }, [t]);

  return { timelineAxis, valueAxies };
}

const valueFormatterUSD = (v: number | null) => {
  if (v) {
    return v.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  return null;
};
export function useSeries() {
  const { t } = useTranslation();
  const { sales_dataset, sales_chart_type } = useChartTunes();
  if (sales_chart_type === 'scatter') {
    throw new Error('Cannot use this series when using scatter chart type.');
  }
  const { dataset_labels, dataset } = useDataset();
  const highlightScope = useMemo<Partial<HighlightScope>>(
    () => ({
      highlighted: 'series',
      faded: 'global',
    }),
    [],
  );

  const series = useMemo<AllSeriesType[]>(() => {
    let fSeries: AllSeriesType[] = [
      {
        type: 'line',
        dataKey: 'revenue',
        label: t('Revenue'),
        yAxisKey: REVENUE_AXIS,
        highlightScope,
        valueFormatter: valueFormatterUSD,
      } as AllSeriesType,
      {
        type: 'line',
        dataKey: 'pending_revenue',
        label: t('Pending revenue'),
        yAxisKey: REVENUE_AXIS,
        highlightScope,
        color: '#d20000',
        valueFormatter: valueFormatterUSD,
      } as AllSeriesType,
    ];
    switch (sales_dataset) {
      case 'sales_by_type': {
        sell_types.forEach((dataKey, index) => {
          fSeries.push({
            type: sales_chart_type,
            dataKey,
            label: dataset_labels[dataKey],
            ...(index === 1 ? { color: '#ffc500' } : {}),
            highlightScope,
            hideTooltip: true,
            valueFormatter: valueFormatterUSD,
            ...(sales_chart_type === 'bar' ? { stack: sales_dataset } : {}),
          } as AllSeriesType);
        });

        break;
      }
      case 'sales_by_category':
      case 'sales_by_brand': {
        const slugs: string[] = [];
        dataset.forEach((v) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { day, month, revenue, sale_count, ...r } = v;
          extractFromAndPushTo(r, slugs);
        });

        fSeries = slugs.map(
          (dataKey, index) =>
            ({
              type: sales_chart_type,
              dataKey,
              label: dataset_labels[dataKey],
              ...(index === 1 ? { color: '#ffc500' } : {}),
              highlightScope,
              valueFormatter: valueFormatterUSD,
              ...(sales_chart_type === 'bar' ? { stack: sales_dataset } : {}),
            }) as AllSeriesType,
        );
        fSeries.push({
          type: 'line',
          dataKey: 'revenue',
          label: t('Total'),
          highlightScope,
          valueFormatter: valueFormatterUSD,
        } as AllSeriesType);

        break;
      }
      case 'sales_by_client':
      case 'sales_by_user': {
        const ids: string[] = [];
        dataset.forEach((v) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { day, month, revenue, pending_revenue, ...r } = v;
          extractFromAndPushTo(r, ids);
        });

        ids.forEach((dataKey, index) => {
          fSeries.push({
            type: sales_chart_type,
            dataKey,
            label: dataset_labels[dataKey],
            ...(index === 1 ? { color: '#ffc500' } : {}),
            highlightScope,
            valueFormatter: valueFormatterUSD,
            ...(sales_chart_type === 'bar' ? { stack: sales_dataset } : {}),
          } as AllSeriesType);
        });

        break;
      }
      default:
        throw new Error('Invalid dataset type');
    }

    return fSeries;
  }, [
    sales_dataset,
    t,
    highlightScope,
    sales_chart_type,
    dataset_labels,
    dataset,
  ]);

  return series;
}

export const SALES_AXIS = 'sales_axis';
export const REVENUE_AXIS = 'revenue_axis';
function extractFromAndPushTo(r: object, arr: string[]) {
  const keysInR = Object.keys(r);

  keysInR.forEach((key) => {
    if (!arr.includes(key)) {
      arr.push(key);
    }
  });
}
