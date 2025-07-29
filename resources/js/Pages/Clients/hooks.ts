import { useAppPage } from '@/hooks';

export function useClients() {
  const { clients } = useAppPage().props;
  if (!clients) {
    throw new Error(
      'For some reason, clients prop are not available in this page.',
    );
  }

  return clients;
}
