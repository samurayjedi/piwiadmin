import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSpy, Field } from 'react-final-form';
import {
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckIcon from '@mui/icons-material/Check';
import Select from '@/src/lib/piwi/core/Select';
import { useErrors } from '@/hooks';
import { useRolesSelectItems } from './hooks';

export default function RecordFields({
  onCancel,
  onAddRole,
}: RecordFieldsProps) {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const rolesSelectItems = useRolesSelectItems();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <FormSpy
      subscription={{ pristine: true, submitting: true }}
      render={({ submitting, pristine }) => (
        <TableRow>
          <TableCell />
          <TableCell>
            <Field
              name="email"
              subscription={{ value: true }}
              render={({ input }) => (
                <TextField
                  {...input}
                  inputRef={ref}
                  label={t('Email')}
                  variant="standard"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  color="secondary"
                  disabled={submitting}
                  onChange={onChangeDecorator(input.onChange)}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                />
              )}
            />
          </TableCell>
          <TableCell>
            <Field
              name="name"
              subscription={{ value: true }}
              render={({ input }) => (
                <TextField
                  {...input}
                  variant="standard"
                  onChange={onChangeDecorator(input.onChange)}
                  label={t('Name')}
                  fullWidth
                  color="secondary"
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                  disabled={submitting}
                />
              )}
            />
          </TableCell>
          <TableCell>
            <Field
              name="role"
              subscription={{ value: true }}
              render={({ input }) => (
                <Select
                  {...input}
                  label={t('Role')}
                  items={{
                    ...rolesSelectItems,
                    add_new_role: t('Add new'),
                  }}
                  variant="standard"
                  color="secondary"
                  fullWidth
                  disabled={submitting}
                  onChange={(ev) => {
                    if (ev.target.value === 'add_new_role') {
                      onAddRole();
                    } else {
                      onChangeDecorator(input.onChange)(ev);
                    }
                  }}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                />
              )}
            />
          </TableCell>
          <TableCell>
            <IconButton
              type={pristine ? 'button' : 'submit'}
              onClick={pristine ? onCancel : undefined}
            >
              {pristine ? <DoDisturbIcon /> : <CheckIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
      )}
    />
  );
}

interface RecordFieldsProps {
  onCancel: () => void;
  onAddRole: () => void;
}
