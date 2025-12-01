import { useAppPage } from '@/hooks';
import { type PaymentMethod } from './types';

export function usePaymentMethods() {
  const { payment_methods } = useAppPage().props;
  if (!payment_methods) {
    throw new Error(
      'The payment methods prop for some reason are not available in this page.',
    );
  }

  return payment_methods as PaymentMethod[];
}
