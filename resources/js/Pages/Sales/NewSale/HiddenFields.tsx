import { type Product } from '@/Pages/Inventory/Products';

export default function HiddenFields({
  id,
  barcode,
  name,
  price,
  sale_price,
  stock,
  brand,
  category,
  tax,
  wholesale,
  wholesale_price,
  wholesale_qty,
}: Product) {
  return (
    <>
      <input type="hidden" name="id[]" value={id} />
      <input type="hidden" name="barcode[]" value={barcode} />
      <input type="hidden" name="name[]" value={name} />
      <input type="hidden" name="price[]" value={price} />
      <input type="hidden" name="sale_price[]" value={sale_price} />
      <input type="hidden" name="stock[]" value={stock} />
      <input type="hidden" name="brand[]" value={brand} />
      <input type="hidden" name="category[]" value={category} />
      <input type="hidden" name="tax[]" value={tax} />
      <input type="hidden" name="wholesale[]" value={wholesale ? 1 : 0} />
      <input
        type="hidden"
        name="wholesale_price[]"
        value={wholesale_price ?? ''}
      />
      <input type="hidden" name="wholesale_qty[]" value={wholesale_qty ?? ''} />
    </>
  );
}
