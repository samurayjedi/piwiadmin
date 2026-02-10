import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Form } from 'react-final-form';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  Paper,
  TableContainer,
} from '@mui/material';
import AppLayout from '@/src/Layouts/AppLayout';
import HtmlForm from '@/src/Components/HtmlForm';
import { useAppDispatch } from '@/store/hooks';
import { clientActionSubmit } from '@/store/client';
import SearchClients from '@/src/Components/SearchClients';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useClients } from './hooks';
import NewClientTableRow from './NewClientTableRow';
import ClientsRows from './ClientsRows';
import NewClientFab from './NewClientFab';
import InDetbSwitch from './InDebtSwitch';
import Paginator from './Paginator';

export default function Clients() {
  const { t } = useTranslation();
  const clients = useClients();
  const dispatch = useAppDispatch();

  return (
    <>
      <AppLayout>
        <SearchClients
          onSubmit={(cls) =>
            router.visit(route('clients', { ids: cls.map((c) => c.id) }))
          }
        />
        <Form
          subscription={{ submitting: true, pristine: true }}
          onSubmit={(data, form) =>
            dispatch(
              clientActionSubmit({
                data,
                onSuccess: () => {
                  form.setConfig('initialValues', {});
                  form.reset();
                },
              }),
            )
          }
          render={({ handleSubmit }) => (
            <HtmlForm onSubmit={handleSubmit}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>{t('Identification')}</TableCell>
                      <TableCell>{t('Name')}</TableCell>
                      <TableCell>{t('Phone')}</TableCell>
                      <TableCell>{t('Address')}</TableCell>
                      <TableCell>{t('Status')}</TableCell>
                      <TableCell>{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!clients.length ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          {t('No records found!')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <ClientsRows />
                    )}
                    <NewClientTableRow />
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <InDetbSwitch />
                      </TableCell>
                      <Paginator colSpan={5} />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
              <NewClientFab />
            </HtmlForm>
          )}
        />
      </AppLayout>
      <ConfirmDeleteDialog />
    </>
  );
}
