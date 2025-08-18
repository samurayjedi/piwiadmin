import { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Form, FormProps } from 'react-final-form';
import {
  Paper as MUIPaper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fab,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConfirmDialog from '@/src/lib/piwi/core/ConfirmDialog';
import { useAppDispatch } from '@/store/hooks';
import { setSync } from '@/store/app';
import IconButtonDropdown from '@/src/lib/piwi/core/IconButtonDropdown';
import HtmlForm from '../HtmlForm';
import TableRowFields from './TableRowFields';
import TableFooterPager from './TableFooterPager';
import { Mode, CrudTableProps } from './types';
import Actions from '../Actions';

export default function CrudTable({
  fields,
  records,
  onSubmit,
  page,
  count,
  rows,
  onPageChange,
  onRowsPerPageChange,
}: CrudTableProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('none');
  const [targetId, setTargetId] = useState(0);
  const percent = 100 / fields.length;

  const cancel = useCallback(() => setMode('none'), []);
  const formOnSubmit = useCallback<FormProps['onSubmit']>(
    (data, form) => {
      return new Promise<void>((resolve) => {
        dispatch(setSync('loading'));
        onSubmit(data, mode, targetId)
          .then(() => {
            if (mode === 'add') {
              window.scrollTo({ top: 0, behavior: 'instant' });
            }
            setMode('none');
            setTargetId(0);
            form.reset();
            dispatch(setSync('ok'));
            resolve();
          })
          .catch(() => {
            dispatch(setSync('ok'));
            resolve();
          });
      });
    },
    [onSubmit, mode, targetId],
  );

  return (
    <Form
      subscription={{ submitting: true, pristine: true }}
      onSubmit={formOnSubmit}
      render={({ /** pristine, */ handleSubmit, form }) => (
        <HtmlForm onSubmit={handleSubmit}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('ID')}</TableCell>
                  {fields.map(([key, label]) => (
                    <TableCell
                      key={`crud-table-cell-caption-${key}`}
                      width={`${percent}%`}
                    >
                      {t(label)}
                    </TableCell>
                  ))}
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {!records.length ? (
                  mode !== 'add' ? (
                    <TableRow>
                      <TableCell colSpan={fields.length + 2} align="center">
                        {t('No records found!')}
                      </TableCell>
                    </TableRow>
                  ) : null
                ) : (
                  records.map((record) =>
                    mode === 'update' && targetId === record.id ? (
                      <TableRowFields
                        key={`crud-table-edit-record-${record.id}-row`}
                        record_id={record.id}
                        fields={fields}
                        mode="update"
                        onCancel={cancel}
                      />
                    ) : (
                      <TableRow key={`crud-table-record-${record.id}-row`}>
                        <TableCell>{`${record.id}`}</TableCell>
                        {fields.map(([key]) => (
                          <TableCell
                            key={`crud-table-record-${record.id}-${key}-cell`}
                          >{`${record[key] ?? ''}`}</TableCell>
                        ))}
                        <TableCell>
                          <IconButtonDropdown icon={<MoreVertIcon />}>
                            <Actions
                              onEdit={() => {
                                form.reset();
                                form.batch(() => {
                                  fields.forEach(([key]) => {
                                    form.change(key, record[key]);
                                  });
                                });
                                setTargetId(parseInt(`${record.id}`, 10));
                                setMode('update');
                              }}
                              onDelete={() => {
                                setTargetId(parseInt(`${record.id}`, 10));
                                setMode('delete');
                              }}
                            />
                          </IconButtonDropdown>
                        </TableCell>
                      </TableRow>
                    ),
                  )
                )}
                {mode === 'add' && (
                  <TableRowFields
                    fields={fields}
                    mode="add"
                    onCancel={cancel}
                  />
                )}
              </TableBody>
              <TableFooterPager
                page={page}
                count={count}
                rows={rows}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
              />
            </Table>
          </TableContainer>
          <ConfirmDialog
            open={mode === 'delete'}
            title={t('Are you sure?')}
            message={t('This action cannot be undone.')}
            onCancel={cancel}
            onConfirm={() => form.submit()}
          />
          <Fab
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              display: mode === 'none' ? 'flex' : 'none',
            }}
            variant="extended"
            color="success"
            onClick={() => {
              form.reset();
              setMode('add');
            }}
          >
            <AddCircleOutlineIcon />
            {t('New')}
          </Fab>
        </HtmlForm>
      )}
    />
  );
}

const Paper = styled(MUIPaper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));
