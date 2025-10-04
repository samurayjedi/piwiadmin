import { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { SearchProps } from '@/src/lib/piwi/laboratory/Search';
import { router } from '@inertiajs/react';
import { SyncState } from '@/store/app';
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

  return [sref, retrieveRef] as const;
}

function useSearchFetch(inputRef: HTMLInputElement | null) {
  const { t } = useTranslation();
  const controller = useRef<AbortController | null>(null);

  return useCallback(
    (field: string, value: string) => {
      /** onBefore */
      if (controller.current !== null) {
        controller.current.abort();
      }
      controller.current = new AbortController();
      /** when error ocurred */
      const throwError = () => {
        return new Promise<void>((resolve) => {
          router.post(
            route('redirect', { route: 'sales.new_sale' }),
            {
              errors: { [field]: t('Error conecting/receiving, try again.') },
            },
            {
              preserveState: true,
              onFinish: () => {
                inputRef?.focus();
                controller.current = null;
                resolve();
              },
            },
          );
        });
      };

      return fetch(route(`search_product.${field}`, { [field]: value }), {
        signal: controller.current.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN':
            _.get(
              document.querySelector('meta[name="csrf-token"]'),
              'content',
            ) || '',
        },
      })
        .then(async (resp) => {
          if (!resp.ok) {
            await throwError();

            return null;
          }

          return resp.json();
        })
        .then(async (json: Record<string, any>) => {
          controller.current = null;
          if (json.status === 0) {
            const promise = new Promise<void>((resolve) => {
              router.post(
                route('redirect', { route: 'sales.new_sale' }),
                {
                  errors: json.errors,
                },
                {
                  preserveState: true,
                  onFinish: () => {
                    setTimeout(() => {
                      inputRef?.focus();
                    }, 300);
                    resolve();
                  },
                },
              );
            });
            await promise;

            return null;
          }

          return json;
        })
        .catch(async (err) => {
          if (err.name !== 'AbortError') {
            await throwError();
          }

          return null;
        });
    },
    [inputRef, t],
  );
}

export function useHandler(
  inputRef: HTMLInputElement | null,
  addAction: SearchProductDialogProps['addAction'],
  onClose: SearchProductDialogProps['onClose'],
) {
  const [products, setProducts] = useState<Product[]>([]);
  const fetchSearch = useSearchFetch(inputRef);

  const mockSearch = useCallback(
    (s: string) => {
      return new Promise<string[]>((resolve) => {
        fetchSearch('name', s).then((r) => {
          if (r) {
            const ps = r.products as Product[];
            const results = _.map(ps, (p) => p.name);

            resolve(results);
          } else {
            resolve([]);
          }
        });
      });
    },
    [fetchSearch],
  );

  const searchSubmit = useCallback<NonNullable<SearchProps['onSubmit']>>(
    (field, value) =>
      new Promise<void>((resolve) => {
        fetchSearch(field, value).then((r) => {
          if (r) {
            setProducts(r.products);
          }

          resolve();
        });
      }),
    [fetchSearch],
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
      const measurement = formData.getAll('measurement[]') as string[];
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
        const q = parseFloat(qty[i]);
        if (q > 0) {
          cart.push({
            id: parseInt(id[i], 10),
            barcode: barcode[i],
            name: name[i],
            price: parseFloat(price[i]),
            profit: parseFloat(profit[i]),
            measurement: measurement[i] as Product['measurement'],
            stock: parseFloat(stock[i]),
            brand: brand[i],
            category: category[i],
            wholesale: Boolean(parseInt(wholesale[i], 10)),
            wholesale_profit: parseFloat(wholesale_profit[i]),
            wholesale_qty: parseFloat(wholesale_qty[i]),
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

  return { products, formRef, mockSearch, searchSubmit, handleAddProducts };
}
