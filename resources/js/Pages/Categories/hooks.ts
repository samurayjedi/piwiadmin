import { useAppPage } from '@/hooks';
import { type Category } from './types';

export function useCategories() {
  const { categories } = useAppPage().props;
  if (!categories) {
    throw new Error(
      'For some reason, categories prop is not available in this page.',
    );
  }

  return categories as Category[];
}
