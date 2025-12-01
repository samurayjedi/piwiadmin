import { useAppPage } from '@/hooks';

export function useMetrics() {
  const {
    props: { metrics },
  } = useAppPage();
  if (!metrics) {
    throw new Error("Metrics aren't not available in this page.");
  }

  return metrics as Metrics;
}

export interface Metrics {
  dayIncome: number;
  weekIncome: number;
  monthIncome: number;
  yearIncome: number;
  pendingIncome: number;
  day_expenses: number;
  week_expenses: number;
  month_expenses: number;
  year_expenses: number;
  to_pay: number;
}
