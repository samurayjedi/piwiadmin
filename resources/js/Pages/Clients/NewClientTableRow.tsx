import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSpy, Field, useForm } from 'react-final-form';
import { TableRow, TableCell, TextField, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import TextFieldMasked from '@/src/lib/piwi/core/TextFieldMasked';
import { useErrors } from '@/hooks';
import { clientAction } from '@/store/client';

export default function NewClientTableRow() {
  const action = useAppSelector((state) => state.client.action);
  if (action !== 'add') {
    return null;
  }

  return (
    <TableRow>
      <NewClient />
    </TableRow>
  );
}

function NewClient() {
  const { t } = useTranslation();
  const form = useForm();
  const dispatch = useAppDispatch();

  const ref = useRef<HTMLInputElement>(null);
  const [fuckErrors, onChangeDecorator] = useErrors();

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, 300);
  }, []);

  return (
    <FormSpy
      subscription={{ pristine: true, submitting: true }}
      render={({ pristine, submitting }) => (
        <>
          <TableCell />
          <TableCell>
            <Field
              name="identification"
              subscription={{ value: true }}
              render={({ input }) => (
                <TextFieldMasked
                  {...input}
                  inputRef={ref}
                  variant="standard"
                  mask="$##########"
                  definitions={{
                    $: /[VEPJCGRvepjcgr]/,
                    '#': /[0-9]/,
                  }}
                  label={t('Identification')}
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
              name="phone"
              subscription={{ value: true }}
              render={({ input }) => (
                <TextFieldMasked
                  {...input}
                  variant="standard"
                  mask="&$##-#######"
                  definitions={{
                    '&': /[0]/,
                    $: /[24]/,
                    '#': /[0-9]/,
                  }}
                  label={t('Phone')}
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
              name="address"
              subscription={{ value: true }}
              render={({ input }) => (
                <TextField
                  {...input}
                  variant="standard"
                  onChange={onChangeDecorator(input.onChange)}
                  label={t('Address')}
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
            <IconButton
              type={pristine ? 'button' : 'submit'}
              onClick={
                pristine
                  ? () => {
                      form.setConfig('initialValues', {});
                      form.reset();
                      dispatch(clientAction([-1, undefined]));
                    }
                  : undefined
              }
            >
              {pristine ? <NotInterestedIcon /> : <SaveIcon />}
            </IconButton>
          </TableCell>
        </>
      )}
    />
  );
}
