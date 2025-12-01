import { Dispatch, SetStateAction, useCallback, useRef } from 'react';
import { type Product } from '@/Pages/Inventory/types';
import { SearchProductDialogProps } from '.';
import { type FormCart } from '../types';

export function useHandler(
  addAction: SearchProductDialogProps['addAction'],
  setProducts: Dispatch<SetStateAction<Product[]>>,
) {
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
      const cart = [] as FormCart[];
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
    }
  }, [addAction, setProducts]);

  return { setProducts, formRef, handleAddProducts };
}
