import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-final-form';
import { router } from '@inertiajs/react';
import {
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TablePagination,
  TableRow,
  TableCell,
  Paper,
  Fab,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AppLayout from '@/src/Layouts/AppLayout';
import { usePaginatorProps } from '@/hooks';
import IconButtonDropdown from '@/src/lib/piwi/core/IconButtonDropdown';
import Actions from '@/src/Components/Actions';
import RecordFields from './RecordFields';
import AddRoleDialog from './AddRoleDialog';
import { useAuthorizedUsers } from './hooks';

export default function AuthorizedUsers() {
  const { t } = useTranslation();
  const [id, setId] = useState(0);
  const [open, setOpen] = useState(false);
  const authorized_users = useAuthorizedUsers();
  const { count, page, rows } = usePaginatorProps();
  const openAddRolDialog = () => setOpen(true);

  return (
    <>
      <AppLayout>
        <Form
          subscription={{ submitting: true, pristine: true }}
          onSubmit={(data, form) =>
            new Promise<void>((resolve) => {
              if (id < 0) {
                router.post(route('add_authorized_user'), data, {
                  onFinish: () => resolve(),
                  onSuccess: () => {
                    form.reset();
                    setId(0);
                  },
                });
              } else {
                router.put(route('update_authorized_user', { id }), data, {
                  onFinish: () => resolve(),
                  onSuccess: () => {
                    form.initialize({});
                    setId(0);
                  },
                });
              }
            })
          }
          render={({ handleSubmit, form }) => (
            <>
              <form onSubmit={handleSubmit}>
                <Table component={Paper}>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>{t('Email')}</TableCell>
                      <TableCell>{t('Name')}</TableCell>
                      <TableCell>{t('Rol')}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!authorized_users.length && id === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          {t('No records found!')}
                        </TableCell>
                      </TableRow>
                    )}
                    {authorized_users.length > 0 &&
                      authorized_users.map((au) =>
                        au.id !== id ? (
                          <TableRow key={`table-row-${au.id}`}>
                            <TableCell>{au.id}</TableCell>
                            <TableCell>{au.email}</TableCell>
                            <TableCell>{au.name}</TableCell>
                            <TableCell>{au.role.name}</TableCell>
                            <TableCell>
                              <IconButtonDropdown icon={<MoreVertIcon />}>
                                <Actions
                                  onEdit={() => {
                                    form.initialize({
                                      email: au.email,
                                      name: au.name,
                                      role: au.role_slug,
                                    });
                                    setId(au.id);
                                  }}
                                  onDelete={() =>
                                    router.delete(
                                      route('delete_authorized_user', {
                                        id: au.id,
                                      }),
                                    )
                                  }
                                />
                              </IconButtonDropdown>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <RecordFields
                            onCancel={() => {
                              form.initialize({});
                              setId(0);
                            }}
                            onAddRole={openAddRolDialog}
                          />
                        ),
                      )}
                    {id < 0 && (
                      <RecordFields
                        onCancel={() => {
                          form.reset();
                          setId(0);
                        }}
                        onAddRole={openAddRolDialog}
                      />
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]} // , { label: t('All'), value: -1 }
                        colSpan={12}
                        page={page}
                        count={count}
                        rowsPerPage={rows}
                        onRowsPerPageChange={(ev) =>
                          router.get(
                            route('authorized_users', {
                              page,
                              rows: parseInt(ev.target.value, 10),
                            }),
                          )
                        }
                        onPageChange={(ev, newPage) =>
                          router.get(
                            route('authorized_users', { page: newPage, rows }),
                          )
                        }
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </form>
              <AddRoleDialog open={open} onClose={() => setOpen(false)} />
            </>
          )}
        />
      </AppLayout>
      <Fab
        title={t('New client')}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: id === 0 ? 'flex' : 'none',
        }}
        color="success"
        onClick={() => setId(-1)}
      >
        <PersonAddIcon />
      </Fab>
    </>
  );
}
