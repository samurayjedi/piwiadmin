import _ from 'lodash';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { TableRow, TableCell, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Products({ onEdit, onDelete }: ProductsProps) {
  const { t } = useTranslation();
  const products = _.get(usePage(), 'props.products', []) as Product[];

  return !products.length ? (
    <TableRow>
      <TableCell colSpan={11} align="center">
        {t('No records found!')}
      </TableCell>
    </TableRow>
  ) : (
    products.map(
      ({
        id,
        barcode,
        name,
        price,
        sale_price,
        tax,
        stock,
        category,
        brand,
        wholesale,
        wholesale_price,
        wholesale_qty,
      }) => (
        <TableRow key={`row-product-${id}`}>
          <TableCell>{barcode}</TableCell>
          <TableCell>{name}</TableCell>
          <TableCell>${price}</TableCell>
          <TableCell>${sale_price}</TableCell>
          <TableCell>${tax}</TableCell>
          <TableCell>{stock}</TableCell>
          <TableCell>{category}</TableCell>
          <TableCell>{brand}</TableCell>
          <TableCell>
            {!wholesale
              ? t('No')
              : `>= ${wholesale_qty}, $${wholesale_price} c/u`}
          </TableCell>
          <TableCell>
            <IconButton onClick={() => onEdit(id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(id)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ),
    )
  );
}

export interface ProductsProps {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export interface Product {
  id: number;
  barcode: string;
  name: string;
  price: string;
  sale_price: string;
  tax: string;
  stock: string;
  category: string;
  brand: string;
  wholesale: boolean;
  wholesale_qty: string;
  wholesale_price: string;
}
