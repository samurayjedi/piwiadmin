import _ from 'lodash';
import { SearchProps } from '@/src/lib/piwi/core/Search';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { setSync, SyncState } from '@/store/app';
import { useAppDispatch } from '@/store/hooks';
import { SearchProductDialogProps } from '.';
import { Cart } from '../../types';

export function useRequestFocus(open: boolean, sync: SyncState) {
  const [sref, retrieveRef] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (sync !== 'loading') {
      if (sref && open) {
        sref.focus();
      }
    }
  }, [open, sref, sync]);

  return retrieveRef;
}

export function useHandler(
  addAction: SearchProductDialogProps['addAction'],
  onClose: SearchProductDialogProps['onClose'],
) {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);

  const handleSubmit = useCallback<NonNullable<SearchProps['onSubmit']>>(
    (field, value) =>
      new Promise<void>((resolve) => {
        const url = route('sales.new_sale.blackhole', {
          action: 'search_product',
        });
        router.post(
          url,
          { field, [field]: value },
          {
            onBefore: () => {
              dispatch(setSync('loading'));
            },
            onSuccess: (data) => {
              const newP = _.get(data, 'props.products', []) as Product[];
              setProducts(newP);
            },
            onFinish: () => {
              dispatch(setSync('ok'));
              resolve();
            },
          },
        );
      }),
    [dispatch],
  );

  const formRef = useRef<HTMLFormElement>(null);
  const handleAddProducts = useCallback(() => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      /** */
      const id = formData.getAll('id[]') as string[];
      const barcode = formData.getAll('barcode[]') as string[];
      const name = formData.getAll('name[]') as string[];
      const price = formData.getAll('price[]') as string[];
      const profit = formData.getAll('profit[]') as string[];
      const stock = formData.getAll('stock[]') as string[];
      const brand = formData.getAll('brand[]') as string[];
      const category = formData.getAll('category[]') as string[];
      const wholesale = formData.getAll('wholesale[]') as string[];
      const wholesale_profit = formData.getAll(
        'wholesale_profit[]',
      ) as string[];
      const wholesale_qty = formData.getAll('wholesale_qty[]') as string[];
      const qty = formData.getAll('qty[]') as string[];
      /** */
      const cart = [] as Cart[];
      id.forEach((v, i) => {
        const q = parseInt(qty[i], 10);
        if (q > 0) {
          cart.push({
            id: parseInt(id[i], 10),
            barcode: barcode[i],
            name: name[i],
            price: parseFloat(price[i]),
            profit: parseFloat(profit[i]),
            stock: parseInt(stock[i], 10),
            brand: brand[i],
            category: category[i],
            wholesale: Boolean(parseInt(wholesale[i], 10)),
            wholesale_profit: parseFloat(wholesale_profit[i]),
            wholesale_qty: parseInt(wholesale_qty[i], 10),
            qty: q,
          });
        }
      });

      addAction(cart);
      setProducts([]);
      if (onClose) {
        onClose();
      }
    }
  }, [addAction, onClose]);

  return { products, formRef, handleSubmit, handleAddProducts };
}
