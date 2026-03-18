import { useMemo, useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useMediaQuery,
  Button,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Select from '@/src/lib/piwi/core/Select';
import { useErrors } from '@/hooks';
import Gap from '@/src/lib/piwi/common/Gap';
import { useForm } from 'react-final-form';
import { capabilities as CAPABILITIES } from '@/consts';

export default function AddRoleDialog({
  open,
  onClose = () => {},
}: AddRoleDialogProps) {
  const { t } = useTranslation();
  const capabilitiesSelectItems = useMemo(() => {
    const c = {} as Record<string, string>;
    CAPABILITIES.forEach((C) => {
      c[C] = t(C);
    });

    return c;
  }, [t]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [submitting, setSubmitting] = useState(false);
  const [fuckErrors, onChangeDecorator] = useErrors();
  const [label, setLabel] = useState('');
  const [capabilities, setCapabilities] = useState([]);
  const form = useForm();
  const ref = useRef<HTMLInputElement>(null);

  const labelOnChange = (ev: any) => setLabel(ev.target.value);
  const capabilitiesOnChange = (ev: any) => setCapabilities(ev.target.value);

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, 100);
  }, [open]);

  return (
    <Dialog
      open={open}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
    >
      <DialogTitle>{t('Add role')}</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={ref}
          value={label}
          label={t('Name')}
          fullWidth
          variant="standard"
          color="secondary"
          disabled={submitting}
          onChange={onChangeDecorator(labelOnChange)}
          error={Boolean(fuckErrors.name)}
          helperText={fuckErrors.name}
        />
        <Gap />
        <TextField
          value={_.snakeCase(label)}
          label={t('Slug')}
          fullWidth
          variant="standard"
          color="secondary"
          disabled
          error={Boolean(fuckErrors.slug)}
          helperText={fuckErrors.slug}
        />
        <Gap />
        <Select
          name="capabilities"
          value={capabilities}
          label={t('Capabilities')}
          multiple
          items={capabilitiesSelectItems}
          variant="standard"
          color="secondary"
          fullWidth
          disabled={submitting}
          onChange={onChangeDecorator(capabilitiesOnChange)}
          error={Boolean(fuckErrors.capabilities)}
          helperText={fuckErrors.capabilities}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="warning" onClick={onClose}>
          {t('Cancel')}
        </Button>
        <Button
          variant="text"
          color="primary"
          onClick={() => {
            setSubmitting(true);
            const data = {
              name: label,
              slug: _.snakeCase(label),
              capabilities,
            };
            router.post(route('add_role'), data, {
              preserveState: true,
              onFinish: () => setSubmitting(false),
              onSuccess: () => {
                form.change('role', _.snakeCase(label));
                setLabel('');
                setCapabilities([]);
                onClose();
              },
            });
          }}
        >
          {t('Ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface AddRoleDialogProps {
  open: boolean;
  onClose?: () => void;
}
