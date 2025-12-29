import { useTranslation } from 'react-i18next';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { Field } from 'react-final-form';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import QtyField from './QtyField';
import LabelTotal from './LabelTotal';
import Wholesale from './Wholesale';

export default function CartItem({ name, onRemove }: CartItemProps) {
  const { t } = useTranslation();

  return (
    <TableRow>
      <TableCell>
        <IconButton onClick={onRemove}>
          <RemoveShoppingCartIcon />
        </IconButton>
      </TableCell>
      <TableCell>
        <Field
          name={`${name}.barcode`}
          subscription={{ value: true }}
          render={({ input }) => (
            <>
              <input type="hidden" name={input.name} value={input.value} />
              {input.value}
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Field
          name={`${name}.name`}
          subscription={{ value: true }}
          render={({ input }) => (
            <>
              <input type="hidden" name={input.name} value={input.value} />
              {input.value}
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Field
          name={`${name}.id`}
          subscription={{ value: true }}
          render={({ input }) => (
            <input type="hidden" name={input.name} value={input.value} />
          )}
        />
        <Field
          name={`${name}.price`}
          subscription={{ value: true }}
          render={({ input }) => (
            <input type="hidden" name={input.name} value={input.value} />
          )}
        />
        <Field
          name={`${name}.profit`}
          subscription={{ value: true }}
          render={({ input }) => (
            <input type="hidden" name={input.name} value={input.value} />
          )}
        />
        <Field
          name={`${name}.measurement`}
          subscription={{ value: true }}
          render={({ input }) => (
            <input type="hidden" name={input.name} value={input.value} />
          )}
        />
        <Field
          name={`${name}.stock`}
          subscription={{ value: true }}
          render={({ input }) => (
            <input type="hidden" name={input.name} value={input.value} />
          )}
        />
        <Field
          name={`${name}.brand`}
          subscription={{ value: true }}
          render={({ input }) => (
            <input type="hidden" name={input.name} value={input.value} />
          )}
        />
        <Field
          name={`${name}.category`}
          subscription={{ value: true }}
          render={({ input }) => (
            <input type="hidden" name={input.name} value={input.value} />
          )}
        />
        <QtyField name={name} />
      </TableCell>
      <TableCell>
        <Wholesale name={name} />
      </TableCell>
      <TableCell>
        <Field
          name={`${name}.sale_price`}
          subscription={{ value: true }}
          render={({ input }) => (
            <TextFieldDolarBs
              {...input}
              label={t('Sale price')}
              variant="standard"
              fullWidth
              color="secondary"
            />
          )}
        />
      </TableCell>
      <TableCell align="right">
        <LabelTotal name={name} />
      </TableCell>
    </TableRow>
  );
}

export interface CartItemProps {
  onRemove: () => void;
  name: string;
}
