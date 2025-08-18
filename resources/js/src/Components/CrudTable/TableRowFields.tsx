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
import SaveIcon from '@mui/icons-material/Save';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { useErrors } from '@/hooks';
import { CrudTableProps, Mode } from './types';

const firstItemId = 'table-row-edit-first-item';
export default function TableRowFields({
  record_id,
  fields,
  mode,
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
      subscription={{ submitting: true, pristine: true, modified: true }}
      render={({ submitting, pristine }) => (
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
                  const fieldProps = (() => {
                    if (f) {
                      if (typeof f.props === 'function') {
                        return f.props(mode);
                      }

                      return f.props;
                    }

                    return {};
                  })();

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
                      disabled={fieldProps.disabled || submitting}
                      onChange={onChangeDecorator(pollito.input.onChange)}
                      error={Boolean(fuckErrors[pollito.input.name])}
                      helperText={fuckErrors[pollito.input.name]}
                      onKeyDown={(e: any) => {
                        if (e.key === 'Escape') {
                          onCancel();
                          if (fieldProps.onKeyDown) {
                            fieldProps.onKeyDown(e);
                          }
                        }
                      }}
                    />
                  );
                }}
              />
            </TableCell>
          ))}
          <TableCell>
            <IconButton
              type={pristine ? 'button' : 'submit'}
              disabled={submitting}
              data-htmlform-skip-this
              onClick={pristine ? onCancel : undefined}
            >
              {pristine ? <NotInterestedIcon /> : <SaveIcon />}
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
  mode: Mode;
  onCancel: () => void;
}
