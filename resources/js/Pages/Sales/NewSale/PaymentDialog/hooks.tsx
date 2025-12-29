import React, { RefObject, useCallback, useContext } from 'react';
import _ from 'lodash';
import { router } from '@inertiajs/react';
import { FormApi } from 'final-form';
import { useAppDispatch } from '@/store/hooks';
import { setSync } from '@/store/app';
import { type Client } from '@/Pages/Clients/types';
import { CartRef } from '../Cart';

export const CTX_STEPPER = React.createContext<CtxState>({
  activeStep: 0,
  clientFound: -1,
  cartRef: { current: null },
  setState: () => {},
});
export function useStepperContext() {
  return useContext(CTX_STEPPER);
}

export function useHandlers(cartRef: RefObject<CartRef>) {
  const dispatch = useAppDispatch();
  const { setState } = useStepperContext();

  const searchClientSubmit = useCallback(
    (data: Record<string, any>, form: FormApi) =>
      new Promise<void>((resolve) => {
        router.post(
          route('sales.new_sale.perform_action'),
          { ...data, action: 'search_client' },
          {
            onSuccess: (r) => {
              const client = _.get(r, 'props.client', null) as Client | null;
              form.change('name', client?.name);
              form.change('phone', client?.phone);
              form.change('address', client?.address);
              setState({ activeStep: 1, clientFound: 1 });
            },
            onError: (e) => {
              form.change('name', '');
              form.change('phone', '');
              form.change('address', '');
              const ciNotFound =
                e.identification_not_found as unknown as boolean;
              if (ciNotFound) {
                setState({ activeStep: 1, clientFound: 0 });
              }
            },
            onFinish: () => {
              resolve();
            },
          },
        );
      }),
    [setState],
  );

  const clientDataSubmit = useCallback(
    (data: Record<string, any>) =>
      new Promise<void>((resolve) => {
        router.post(route('clients.store'), data, {
          onSuccess: () => setState({ clientFound: 1, activeStep: 2 }),
          onFinish: () => resolve(),
        });
      }),
    [setState],
  );

  const handleSellSubmit = useCallback(
    (data: Record<string, any>) => {
      const cartForm = document.getElementById('new-sale-cart-form');
      if (!cartForm) {
        throw new Error('Cannot get the cart form!!');
      }

      return new Promise<void>((resolve) => {
        router.post(
          route('sales.new_sale.save'),
          { ...data, ...cartRef.current?.data() },
          {
            forceFormData: true,
            onBefore: () => {
              dispatch(setSync('loading'));
            },
            onFinish: () => {
              dispatch(setSync('ok'));
              resolve();
            },
          },
        );
      });
    },
    [cartRef, dispatch],
  );

  return {
    searchClientSubmit,
    clientDataSubmit,
    handleSellSubmit,
  } as const;
}

export interface CtxState {
  activeStep: number;
  clientFound: number;
  cartRef: RefObject<CartRef>;
  setState: React.Dispatch<
    React.SetStateAction<{ activeStep: number; clientFound: number }>
  >;
}
