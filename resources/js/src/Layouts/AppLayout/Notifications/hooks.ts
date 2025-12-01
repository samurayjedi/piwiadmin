import { useAppPage } from '@/hooks';

export function useNotifications() {
  const {
    props: { notifications },
  } = useAppPage();
  if (!notifications) {
    throw new Error("Notifications aren't available in this context!!!");
  }

  return notifications as {
    id: string;
    data: Record<string, any>;
  }[];
}
