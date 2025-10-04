import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { PieChart } from '@mui/x-charts/PieChart';
import { MakeOptional } from '@mui/x-date-pickers/internals';
import { PieSeriesType, PieValueType } from '@mui/x-charts';
import { useChartHeight, useChartTunes, useDataset } from './hooks';

export default function SalesPieChart() {
  const { t } = useTranslation();
  const chartHeight = useChartHeight();
  const { dataset, dataset_labels } = useDataset();
  const { sales_dataset } = useChartTunes();

  const series: MakeOptional<
    PieSeriesType<MakeOptional<PieValueType, 'id'>>,
    'type'
  >[] = (() => {
    let iteration = 0;
    let secondIteration = 0;
    switch (sales_dataset) {
      case 'sales_by_category':
      case 'sales_by_brand': {
        const revenues: Record<string, number> = {};
        const counts: Record<string, number> = {};
        _.forEach(dataset[0], (v, k) => {
          if (k.includes('_revenue')) {
            revenues[k] = v as number;
          } else {
            counts[k] = v as number;
          }
        });

        return [
          {
            innerRadius: 0,
            outerRadius: 80,
            data: _.map(counts, (item, key) => ({
              label: dataset_labels[key],
              value: item as number,
              ...(iteration++ === 1 ? { color: '#a12a5b' } : {}),
            })),
            valueFormatter: (v) => t('Amount selled x.', { x: v.value }),
          },
          {
            id: 'outer',
            innerRadius: 100,
            outerRadius: 120,
            data: _.map(revenues, (item, key) => ({
              label: t('X revenue', {
                x: dataset_labels[key.replace('_revenue', '')],
              }),
              value: item,
              ...(secondIteration++ === 1 ? { color: '#a12a5b' } : {}),
            })),
            valueFormatter: (v) =>
              v.value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              }),
          },
        ];
      }
    }
    /** Sales by type, user and client */
    const { revenue, pending_revenue, ...rest } = dataset[0];

    return [
      {
        innerRadius: 0,
        outerRadius: 80,
        data: _.map(rest, (item, key) => ({
          label: dataset_labels[key],
          value: item as number,
          ...(iteration++ === 1 ? { color: '#a12a5b' } : {}),
        })),
        valueFormatter: (v) =>
          v.value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
      },
      {
        id: 'outer',
        innerRadius: 100,
        outerRadius: 120,
        data: [
          {
            label: t('Revenue'),
            value: revenue as number,
            color: '#006b14',
          },
          {
            label: t('Pending revenue'),
            value: pending_revenue as number,
            color: '#d40d0d',
          },
        ],
        valueFormatter: (v) =>
          v.value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
      },
    ];
  })();

  return <PieChart series={series} height={chartHeight} />;
}
