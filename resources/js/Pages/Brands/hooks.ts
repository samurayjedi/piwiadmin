import { useAppPage } from '@/hooks';

export function useBrands() {
  const { brands } = useAppPage().props;
  if (!brands) {
    throw new Error(
      'For some reason, the brands props are no available in this page.',
    );
  }

  return brands;
}
