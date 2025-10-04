import styled from '@emotion/styled';
import { router } from '@inertiajs/react';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { Typography, IconButton, Button, Box } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { sell_types } from '@/consts';
import { useErrors } from '@/hooks';
import { arrayToRecord } from '@/src/lib/miscUtils';
import { addDate, parse } from '@/src/lib/piwi/dateFnsFacade';
import PiwiSelect from '@/src/lib/piwi/core/Select';
import MUIDatePicker from '@/src/lib/piwi/core/DatePicker';
import { useSaleFilters } from '../hooks';

export default function FiltersForm({ fullWidth = false }: FiltersFormProps) {
  const { t } = useTranslation();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const { sale_type, date_init, date_end } = useSaleFilters();

  return (
    <Form
      initialValues={{
        sale_type,
        ...(date_init !== 'none' ? { date_init } : {}),
        ...(date_end !== 'none' ? { date_end } : {}),
      }}
      subscription={{ submitting: true }}
      onSubmit={(data) =>
        new Promise<void>((resolve) => {
          router.get(
            route('sale_type', data),
            {},
            {
              onFinish: () => resolve(),
            },
          );
        })
      }
      render={({ submitting, handleSubmit }) => (
        <FiltersFormWrapper fullWidth={fullWidth} onSubmit={handleSubmit}>
          {!fullWidth && <Label variant="body2">{t('Show')}:</Label>}
          <Field
            name="sale_type"
            subscription={{ value: true }}
            render={({ input }) => (
              <Select
                {...input}
                label={fullWidth ? t('Show') : undefined}
                fullWidth={fullWidth}
                size="small"
                items={{
                  all: t('All'),
                  ...arrayToRecord(sell_types, (item) => t(item)),
                }}
                variant="standard"
                color="primary"
                disabled={submitting}
                onChange={onChangeDecorator(input.onChange)}
                error={Boolean(fuckErrors[input.name])}
                helperText={fuckErrors[input.name]}
              />
            )}
          />
          {!fullWidth && <Label variant="body2">{t('Date')}:</Label>}
          <Field
            name="date_init"
            subscription={{ value: true }}
            render={({ input }) => (
              <>
                <DatePicker
                  {...input}
                  label={fullWidth ? t('Date') : undefined}
                  fullWidth={fullWidth}
                  disableFuture
                  size="small"
                  color="primary"
                  variant="standard"
                  disabled={submitting}
                  onChange={onChangeDecorator(input.onChange)}
                  error={Boolean(fuckErrors[input.name])}
                  helperText={fuckErrors[input.name]}
                  clearable
                />
                {!fullWidth && <Label variant="body2">{t('To')}:</Label>}
                <Field
                  name="date_end"
                  subscription={{ value: true }}
                  render={(pollito) => (
                    <DatePicker
                      {...pollito.input}
                      label={fullWidth ? t('To') : undefined}
                      fullWidth={fullWidth}
                      disableFuture
                      size="small"
                      color="primary"
                      variant="standard"
                      disabled={submitting}
                      onChange={onChangeDecorator(pollito.input.onChange)}
                      error={Boolean(fuckErrors[pollito.input.name])}
                      helperText={fuckErrors[pollito.input.name]}
                      clearable
                      minDate={
                        input.value
                          ? addDate(parse(input.value), '1 day')
                          : undefined
                      }
                    />
                  )}
                />
              </>
            )}
          />
          {!fullWidth ? (
            <SubmitIconButton type="submit" size="small" disabled={submitting}>
              <FilterAltIcon />
            </SubmitIconButton>
          ) : (
            <>
              <Box sx={{ flex: 1 }} />
              <Button
                type="submit"
                startIcon={<FilterAltIcon />}
                disabled={submitting}
              >
                {t('Filter')}
              </Button>
            </>
          )}
        </FiltersFormWrapper>
      )}
    />
  );
}

interface FiltersFormProps {
  fullWidth?: boolean;
}

const FiltersFormWrapper = styled.form<{ fullWidth: boolean }>(
  ({ fullWidth }) => ({
    display: 'flex',
    flexDirection: !fullWidth ? 'row' : 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    height: !fullWidth ? 'auto' : '100%',
  }),
);

const Label = styled(Typography)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

const Select = styled(PiwiSelect)(({ fullWidth }) =>
  !fullWidth
    ? {
        width: 100,
      }
    : {},
);

const DatePicker = styled(MUIDatePicker)(({ fullWidth }) =>
  !fullWidth ? { width: 180 } : {},
);

const SubmitIconButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));
