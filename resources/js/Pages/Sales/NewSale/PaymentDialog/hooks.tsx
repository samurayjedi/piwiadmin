import React, { useCallback, useContext } from 'react';
import _ from 'lodash';
import { router } from '@inertiajs/react';
import { Client } from '@/Pages/Clients';
import { FormApi } from 'final-form';
import { useAppDispatch } from '@/store/hooks';
import { setSync } from '@/store/app';
import { useCartContext } from '../hooks';

export const CTX_STEPPER = React.createContext<CtxState>({
  open: false,
  activeStep: 0,
  clientFound: -1,
  amount: 0,
  setState: () => {},
});
export function useStepperContext() {
  return useContext(CTX_STEPPER);
}

export function useHandlers() {
  const dispatch = useAppDispatch();
  const cartContext = useCartContext();
  const { setState } = useStepperContext();

  const searchClientSubmit = useCallback(
    (data: Record<string, any>, form: FormApi) =>
      new Promise<void>((resolve) => {
        router.post(
          route('sales.new_sale.blackhole', {
            action: 'search_client',
          }),
          data,
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
      const cartForm = cartContext.current;
      if (!cartForm) {
        throw new Error('Cannot get the cart form!!');
      }
      const formData = new FormData(cartForm);
      _.forEach(data, (v, k) => {
        if (k === 'payment_methods') {
          _.map(v, (paymentMethod) => {
            formData.append(`${k}[]`, paymentMethod);
          });
        } else {
          formData.append(k, v);
        }
      });

      return new Promise<void>((resolve) => {
        router.post(route('sales.new_sale.save'), formData, {
          onBefore: () => {
            dispatch(setSync('loading'));
          },
          onFinish: () => {
            dispatch(setSync('ok'));
            resolve();
          },
        });
      });
    },
    [cartContext, dispatch],
  );

  return {
    searchClientSubmit,
    clientDataSubmit,
    handleSellSubmit,
  } as const;
}

export interface CtxState {
  open: boolean;
  activeStep: number;
  clientFound: number;
  amount: number;
  setState: React.Dispatch<
    React.SetStateAction<{ activeStep: number; clientFound: number }>
  >;
}
