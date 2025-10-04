import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import {
  AreaPlot,
  LineHighlightPlot,
  LinePlot,
  MarkPlot,
} from '@mui/x-charts/LineChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsOverlay } from '@mui/x-charts/ChartsOverlay';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import {
  useDataset,
  // SALES_AXIS,
  REVENUE_AXIS,
  useSeries,
  useAxies,
  useChartHeight,
  useChartTunes,
} from './hooks';

const clipPathId = 'sales-chart-clip-area';
export default function SalesChart({ width }: { width: number }) {
  const { dataset } = useDataset();
  const { sales_chart_type } = useChartTunes();
  const { timelineAxis, valueAxies } = useAxies();
  const series = useSeries();
  const chartHeight = useChartHeight();

  return (
    <ChartContainer
      xAxis={timelineAxis}
      yAxis={valueAxies}
      series={series}
      dataset={dataset}
      width={width}
      height={chartHeight}
    >
      {series.length <= 6 && <ChartsLegend />}
      <ChartsGrid horizontal />
      <g clipPath={`url(#${clipPathId})`}>
        {/* Elements clipped inside the drawing area. */}
        {sales_chart_type === 'bar' && <BarPlot />}
        <AreaPlot />
        <LinePlot />
        <ChartsOverlay />
        <ChartsAxisHighlight x="line" y="line" />
      </g>
      <ChartsXAxis />
      <ChartsYAxis axisId={REVENUE_AXIS} />
      {/** <ChartsYAxis axisId={SALES_AXIS} position="right" /> */}
      <g data-drawing-container>
        {/* Elements able to overflow the drawing area. */}
        <MarkPlot />
      </g>
      <LineHighlightPlot />
      <ChartsClipPath id={clipPathId} />
      <ChartsTooltip
        slotProps={{
          popper: {
            placement: 'left',
          },
        }}
      />
    </ChartContainer>
  );
}
