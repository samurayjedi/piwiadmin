import { useAppPage } from '@/hooks';
import { ClientWithRelations } from './types';

export function useClients() {
  const { clients } = useAppPage().props;
  if (!clients) {
    throw new Error(
      'For some reason, clients prop are not available in this page.',
    );
  }

  return clients as ClientWithRelations[];
}

export function useFilters() {
  const { props } = useAppPage();
  if (
    !Object.hasOwnProperty.call(props, 'in_debt') ||
    !Object.hasOwnProperty.call(props, 'ids')
  ) {
    throw new Error(
      'For some reason, filters props are not available in this page.',
    );
  }

  return { in_debt: props.in_debt as 0 | 1, ids: props.ids as number[] | null };
}
