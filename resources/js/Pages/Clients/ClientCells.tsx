import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell, TextField, IconButton, Button } from '@mui/material';
import { FormSpy, Field, useForm } from 'react-final-form';
import TextFieldMasked from '@/src/lib/piwi/core/TextFieldMasked';
import IconButtonDropdown from '@/src/lib/piwi/core/IconButtonDropdown';
import Actions from '@/src/Components/Actions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SaveIcon from '@mui/icons-material/Save';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { useErrors } from '@/hooks';
import CollapseButton from '@/src/lib/piwi/animated/CollapsibleRows/CollapseButton';
import { ClientWithRelations } from './types';

export default function ClientCells({
  active,
  editing,
  onEdit,
  onDelete,
  onCancel,
  onRequestCollapse,
  ...client
}: ClientTableRowProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  const [fuckErrors, onChangeDecorator] = useErrors();
  const form = useForm();
  const havePendingSales = (() => {
    for (let i = 0; i < client.sales.length; i++) {
      const sale = client.sales[i];
      if (sale.status === 'pending') return true;
    }

    return false;
  })();

  useEffect(() => {
    if (editing) {
      if (ref.current) {
        ref.current.focus();
      }
    }
  }, [editing]);

  return (
    <FormSpy
      subscription={{ submitting: true, pristine: true }}
      render={({ submitting, pristine }) => (
        <>
          <TableCell>
            {client.sales.length > 0 ? (
              <CollapseButton
                disabled={editing}
                active={active}
                variant="text"
                onClick={onRequestCollapse}
                size="small"
              >
                #{client.id}
              </CollapseButton>
            ) : (
              <Button variant="text" size="small">
                #{client.id}
              </Button>
            )}
          </TableCell>
          <TableCell>
            {!editing ? (
              client.identification
            ) : (
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
            )}
          </TableCell>
          <TableCell>
            {!editing ? (
              client.name
            ) : (
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
            )}
          </TableCell>
          <TableCell>
            {!editing ? (
              client.phone ? (
                client.phone
              ) : (
                t('Does not specify')
              )
            ) : (
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
            )}
          </TableCell>
          <TableCell>
            {!editing ? (
              client.address ? (
                client.address
              ) : (
                t('Does not specify')
              )
            ) : (
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
            )}
          </TableCell>
          <TableCell>
            <Button
              variant="text"
              color={havePendingSales ? 'warning' : 'success'}
              size="small"
            >
              {havePendingSales ? t('In debt') : t('Solvent')}
            </Button>
          </TableCell>
          <TableCell>
            {!editing ? (
              <IconButtonDropdown icon={<MoreVertIcon />}>
                <Actions
                  onEdit={() => {
                    form.setConfig('initialValues', {
                      identification: client.identification,
                      name: client.name,
                      phone: client.phone,
                      address: client.address,
                    });
                    onEdit(client.id);
                  }}
                  onDelete={() => onDelete(client.id)}
                />
              </IconButtonDropdown>
            ) : (
              <IconButton
                type={pristine ? 'button' : 'submit'}
                onClick={pristine ? onCancel : undefined}
              >
                {pristine ? <NotInterestedIcon /> : <SaveIcon />}
              </IconButton>
            )}
          </TableCell>
        </>
      )}
    />
  );
}

export interface ClientTableRowProps extends ClientWithRelations {
  active: boolean;
  editing: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
  onRequestCollapse: () => void;
}
