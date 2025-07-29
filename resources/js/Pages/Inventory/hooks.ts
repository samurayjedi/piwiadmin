import { useAppPage } from '@/hooks';

export function useProducts() {
  const { products } = useAppPage().props;
  if (!products) {
    throw new Error(
      'For some reason, the products page props are not available.',
    );
  }

  return products;
}
