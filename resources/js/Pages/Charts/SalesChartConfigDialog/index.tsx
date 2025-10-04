import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Form, Field } from 'react-final-form';
import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  useMediaQuery,
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { useErrors, usePaginatorProps } from '@/hooks';
import Select from '@/src/lib/piwi/core/Select';
import Options from '@/src/lib/piwi/core/Options';
import { useChartTunes } from '../hooks';
import DateField from './DateField';

export default function SalesChartConfigDialog({ open, onClose }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fuckErrors, onChangeDecorator] = useErrors();
  const {
    sales_dataset,
    sales_timeframe,
    sales_date,
    sales_chart_type,
    sales_layout,
  } = useChartTunes();
  const { page, count, rows } = usePaginatorProps();

  return (
    <Dialog
      open={open}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
    >
      <DialogContent>
        <Header>
          <Typography variant="h5">{t('Chart settings')}</Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Header>
        <Box sx={{ p: 1 }} />
        <Form
          subscription={{ submitting: true }}
          initialValues={{
            sales_dataset,
            sales_timeframe,
            sales_date,
            sales_chart_type,
            sales_layout,
          }}
          onSubmit={(data) =>
            new Promise<void>((resolve) => {
              router.get(
                route('charts', { ...data, page, count, rows }),
                {},
                {
                  onFinish: () => resolve(),
                  onSuccess: () => onClose(),
                },
              );
            })
          }
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Field
                name="sales_dataset"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Select
                    {...input}
                    label={t('Dataset')}
                    items={{
                      sales_by_type: t('Sales by type'),
                      sales_by_category: t('Sales by category'),
                      sales_by_brand: t('Sales by brand'),
                      sales_by_client: t('Sales by client'),
                      sales_by_user: t('Sales by user'),
                    }}
                    variant="standard"
                    color="secondary"
                    fullWidth
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                  />
                )}
              />
              <Box sx={{ pb: 1 }} />
              <Field
                name="sales_timeframe"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Select
                    {...input}
                    label={t('Timeframe')}
                    items={{
                      sales_by_month: t('By month'),
                      sales_by_day: t('By day'),
                    }}
                    variant="standard"
                    color="secondary"
                    fullWidth
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                  />
                )}
              />
              <DateField />
              <Field
                name="sales_chart_type"
                subscription={{ value: true }}
                render={({ input }) => (
                  <Options
                    {...input}
                    type="radio"
                    label={t('Chart type')}
                    options={{
                      bar: t('Bars'),
                      line: t('Lines'),
                      scatter: t('Scatter'),
                      pie: t('Pie'),
                    }}
                    color="secondary"
                    disabled={submitting}
                    onChange={onChangeDecorator(input.onChange)}
                    error={Boolean(fuckErrors[input.name])}
                    helperText={fuckErrors[input.name]}
                  />
                )}
              />
              <Actions>
                <Button type="submit" variant="text" color="primary">
                  {t('Accept')}
                </Button>
              </Actions>
            </form>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const Header = styled.div({
  display: 'flex',
});

const Actions = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
});
