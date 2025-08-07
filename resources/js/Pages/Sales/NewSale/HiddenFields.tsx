export default function HiddenFields({
  id,
  barcode,
  name,
  price,
  profit,
  measurement,
  stock,
  brand,
  category,
  wholesale,
  wholesale_profit,
  wholesale_qty,
}: Product) {
  return (
    <>
      <input type="hidden" name="id[]" value={id} />
      <input type="hidden" name="barcode[]" value={barcode} />
      <input type="hidden" name="name[]" value={name} />
      <input type="hidden" name="price[]" value={price} />
      <input type="hidden" name="profit[]" value={profit} />
      <input type="hidden" name="measurement[]" value={measurement} />
      <input type="hidden" name="stock[]" value={stock} />
      <input type="hidden" name="brand[]" value={brand} />
      <input type="hidden" name="category[]" value={category} />
      <input type="hidden" name="wholesale[]" value={wholesale ? 1 : 0} />
      <input
        type="hidden"
        name="wholesale_profit[]"
        value={wholesale_profit ?? ''}
      />
      <input type="hidden" name="wholesale_qty[]" value={wholesale_qty ?? ''} />
    </>
  );
}
