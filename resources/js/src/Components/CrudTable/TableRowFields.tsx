import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextField,
  TableRow,
  TableCell,
  IconButton,
  TableRowProps,
} from '@mui/material';
import TextFieldMasked from '@/src/lib/piwi/core/TextFieldMasked';
import Select from '@/src/lib/piwi/core/Select';
import { Field, FormSpy } from 'react-final-form';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useErrors } from '@/hooks';
import { CrudTableProps } from './types';

const firstItemId = 'table-row-edit-first-item';
export default function TableRowFields({
  record_id,
  fields,
  onCancel,
  ...props
}: NewCategoryProps) {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();

  useEffect(() => {
    const firstItem = document.getElementById(firstItemId);
    if (firstItem) {
      firstItem.focus();
    }
  }, []);

  return (
    <FormSpy
      subscription={{ submitting: true }}
      render={({ submitting }) => (
        <TableRow {...props}>
          <TableCell>{record_id ?? '#'}</TableCell>
          {fields.map(([key, label, f], index) => (
            <TableCell
              key={`crud-table-cell-field-${key}-record-${record_id ?? 'new'}`}
            >
              <Field
                name={key}
                subscription={{ value: true }}
                render={(pollito) => {
                  const type = f?.type ?? 'textfield';
                  const fieldProps = f?.props ?? {};

                  const MyField = (() => {
                    switch (type) {
                      case 'textfield-masked':
                        return TextFieldMasked;
                      case 'select':
                        return Select;
                      default:
                        return TextField;
                    }
                  })() as any;

                  return (
                    <MyField
                      {...fieldProps}
                      {...pollito.input}
                      {...(index === 0 ? { id: firstItemId } : {})}
                      variant="standard"
                      label={t(label)}
                      fullWidth
                      color="primary"
                      disabled={submitting}
                      onChange={onChangeDecorator(pollito.input.onChange)}
                      error={Boolean(fuckErrors[pollito.input.name])}
                      helperText={fuckErrors[pollito.input.name]}
                    />
                  );
                }}
              />
            </TableCell>
          ))}
          <TableCell>
            <IconButton type="submit" disabled={submitting}>
              <CheckIcon />
            </IconButton>
            <IconButton disabled={submitting} onClick={onCancel}>
              <ClearIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      )}
    />
  );
}

export interface NewCategoryProps extends TableRowProps {
  record_id?: number;
  fields: CrudTableProps['fields'];
  onCancel: () => void;
}
