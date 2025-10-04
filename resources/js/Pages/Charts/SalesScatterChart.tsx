import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { AxisConfig, ScatterSeriesType, ScatterValueType } from '@mui/x-charts';
import { sell_types } from '@/consts';
import { parse, format } from '@/src/lib/piwi/dateFnsFacade';
import { useDataset, useChartHeight, useChartTunes } from './hooks';

export default function SalesScatterChart() {
  const { t } = useTranslation();
  const { dataset, dataset_labels } = useDataset();
  const { sales_dataset } = useChartTunes();
  const chartHeight = useChartHeight();
  const series = useMemo(() => {
    let fSeries: ScatterSeriesType[] = [];

    switch (sales_dataset) {
      case 'sales_by_type':
      case 'sales_by_client':
      case 'sales_by_user':
        const keys = (() => {
          if (sales_dataset === 'sales_by_type') {
            return sell_types as unknown as string[];
          }

          const ids: (string | number)[] = [
            ...new Set(dataset.map((item) => item.id)),
          ];

          return ids;
        })();
        fSeries = keys.map((key, index) => {
          let predicate = (item: Record<string, string | number>) =>
            key === item.id;
          if (sales_dataset === 'sales_by_type') {
            predicate = (item: Record<string, string | number>) =>
              item.payment_type === key;
          }

          return {
            type: 'scatter',
            label: dataset_labels[!isNaN(key as number) ? `#${key}` : key],
            ...(index === 1 ? { color: '#d20000' } : {}),
            valueFormatter: (item) => {
              const { x, y, z } = item;
              const total_amount = y.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              });
              const date = format(new Date(x), 'dd-MM-yyyy hh:mm aaaa');

              let pending: string | number = y - z;
              if (pending > 0) {
                pending = t('To pay x', {
                  pending: pending.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }),
                });
              } else {
                return `(${total_amount}, ${date})`;
              }

              return `(Total: ${total_amount}, ${pending}, ${date})`;
            },
            data: dataset.filter(predicate).map((sale) => ({
              x: parse(
                sale.created_at as string,
                'yyyy-MM-dd HH:mm:ss',
              ).getTime(),
              y: sale.total_amount,
              z: sale.amount_paid,
              id: `${key}-${sale.created_at}`,
            })) as ScatterValueType[],
          };
        });
        break;
      case 'sales_by_category':
      case 'sales_by_brand':
        const key =
          sales_dataset === 'sales_by_category' ? 'category' : 'brand';
        const slugs: string[] = [
          ...new Set(dataset.map((item) => item[`${key}_slug`] as string)),
        ];
        fSeries = slugs.map((slug, index) => {
          return {
            type: 'scatter',
            label: dataset_labels[slug],
            ...(index === 1 ? { color: '#d20000' } : {}),
            valueFormatter: (item) => {
              const { x, y, z } = item;
              const price = y.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              });
              const date = format(new Date(x), 'dd-MM-yyyy hh:mm aaaa');

              return t('Amount amount, Price price, Date date.', {
                amount: z,
                price,
                date,
              }) as string;
            },
            data: dataset
              .filter((item) => item[`${key}_slug`] === slug)
              .map((item) => ({
                x: new Date(item.created_at).getTime(),
                y: item.revenue,
                z: item.sale_count,
                id: `${item[key]}-${item.created_at}`,
              })) as ScatterValueType[],
          };
        });
        break;
    }

    return fSeries;
  }, [dataset, dataset_labels, sales_dataset, t]);

  let prevMonth = '';
  const timelineAxis = [
    {
      id: 'timeline',
      scaleType: 'time',
      valueFormatter: (value) => {
        const month = format(value, 'MMM');
        const day = format(value, 'dd');
        const dayName = format(value, 'EEE');
        if (prevMonth !== month) {
          prevMonth = month;

          return `${month} ${day}`;
        }

        return `${dayName} ${day}`;
      },
    } as AxisConfig,
  ];
  const valueAxies = [
    {
      id: 'revenue',
      scaleType: 'linear',
      position: 'left',
      valueFormatter: (v) => {
        return v.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
      },
    } as AxisConfig,
  ];

  return (
    <ScatterChart
      grid={{ vertical: true, horizontal: true }}
      xAxis={timelineAxis}
      yAxis={valueAxies}
      height={chartHeight}
      series={series}
    />
  );
}
