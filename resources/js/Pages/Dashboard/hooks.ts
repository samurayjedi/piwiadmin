import { useAppPage } from '@/hooks';

export function useMetrics() {
  const {
    props: { metrics },
  } = useAppPage();
  if (!metrics) {
    throw new Error("Metrics aren't not available in this page.");
  }

  return metrics;
}
