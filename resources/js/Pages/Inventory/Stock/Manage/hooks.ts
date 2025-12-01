import { useAppPage } from '@/hooks';

export function useProduct() {
  const {
    props: { product },
  } = useAppPage();

  if (product === undefined) {
    throw new Error('Product its\t available in this context.');
  }
  const p = product as Product | null;

  return p;
}
