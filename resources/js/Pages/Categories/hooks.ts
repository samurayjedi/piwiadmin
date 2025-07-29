import { useAppPage } from '@/hooks';

export function useCategories() {
  const { categories } = useAppPage().props;
  if (!categories) {
    throw new Error(
      'For some reason, categories prop is not available in this page.',
    );
  }

  return categories;
}
