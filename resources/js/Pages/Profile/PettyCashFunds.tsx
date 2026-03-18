import { useMemo, useState } from 'react';
import _ from 'lodash';
import { router } from '@inertiajs/react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Form, Field } from 'react-final-form';
import { FieldArray, useFieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ClearIcon from '@mui/icons-material/Clear';
import Select from '@/src/lib/piwi/core/Select';
import TextFieldDolarBs from '@/src/Components/TextFieldDolarBs';
import Glue from '@/src/lib/piwi/common/Glue';
import { convertBracketToDot } from '@/src/lib/miscUtils';
import { useErrors } from '@/hooks';
import { usePaymentMethods } from '../PaymentMethods/hooks';
import { usePaydesk } from '../Paydesk/hooks';

const init = { id: -1, payment_method: '', amount: 0 };
export default function PettyCashFunds({ mark }: { mark: string }) {
  const { t } = useTranslation();
  const paydesk = usePaydesk();
  const payment_methods = usePaymentMethodsItems();
  const [fuckErrors, onChangeDecorator] = useErrors();
  const initialValues = useMemo(
    () => ({
      petty_cash_funds: !paydesk.petty_cash_funds.length
        ? [init]
        : paydesk.petty_cash_funds.map((p) => ({
            id: p.id,
            payment_method: p.payment_method_id,
            amount: p.amount,
          })),
    }),
    [paydesk.petty_cash_funds],
  );
  const [id, setId] = useState(-1);

  return (
    <Form
      initialValues={initialValues}
      mutators={{
        ...arrayMutators,
      }}
      subscription={{ pristine: true, submitting: true }}
      onSubmit={(data) =>
        new Promise<void>((resolve) => {
          if (id <= 0) {
            router.post(
              route('petty_cash_funds'),
              { ...data, paydesk_id: paydesk.id },
              {
                onFinish: () => {
                  location.href = `#${mark}`;
                  resolve();
                },
              },
            );
          } else {
            router.delete(route('petty_cash_funds.delete', { id }), {
              onSuccess: () => setId(-1),
              onFinish: () => {
                location.href = `#${mark}`;
                resolve();
              },
            });
          }
        })
      }
      render={({ submitting, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={8}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('Payment method')}</TableCell>
                    <TableCell>{t('Amount')}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <FieldArray
                  name="petty_cash_funds"
                  subscription={{ value: true }}
                  render={({ fields }) => (
                    <TableBody>
                      {!fields.length ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            {t('No records has been added!')}
                          </TableCell>
                        </TableRow>
                      ) : (
                        fields.map((name, i) => (
                          <TableRow key={`table-row-${name}`}>
                            <TableCell style={{ verticalAlign: 'top' }}>
                              <Field
                                name={`${name}.payment_method`}
                                subscription={{ value: true }}
                                render={({ input }) => (
                                  <Select
                                    {...input}
                                    label={t('Payment Methods')}
                                    items={payment_methods}
                                    variant="standard"
                                    fullWidth
                                    color="primary"
                                    disabled={submitting}
                                    onChange={onChangeDecorator(input.onChange)}
                                    error={Boolean(
                                      _.get(
                                        fuckErrors,
                                        convertBracketToDot(input.name),
                                      ),
                                    )}
                                    helperText={_.get(
                                      fuckErrors,
                                      convertBracketToDot(input.name),
                                    )}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Field
                                name={`${name}.amount`}
                                subscription={{ value: true }}
                                render={({ input }) => (
                                  <TextFieldDolarBs
                                    {...input}
                                    variant="standard"
                                    label={t('Price')}
                                    fullWidth
                                    color="secondary"
                                    disabled={submitting}
                                    onChange={onChangeDecorator(input.onChange)}
                                    error={Boolean(
                                      _.get(
                                        fuckErrors,
                                        convertBracketToDot(input.name),
                                      ),
                                    )}
                                    helperText={_.get(
                                      fuckErrors,
                                      convertBracketToDot(input.name),
                                    )}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              {id > 0 && id === fields.value.at(i).id ? (
                                <div>
                                  <IconButton type="submit">
                                    <DoneAllIcon />
                                  </IconButton>
                                  <IconButton onClick={() => setId(-1)}>
                                    <ClearIcon />
                                  </IconButton>
                                </div>
                              ) : (
                                <Delete
                                  i={i}
                                  onDelete={(idToDel) => setId(idToDel)}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      <TableRow>
                        <TableCell colSpan={3}>
                          <ActionsContainer>
                            <Button
                              startIcon={<AddIcon />}
                              variant="text"
                              color="primary"
                              onClick={() => {
                                fields.push({
                                  ...init,
                                });
                              }}
                              disabled={submitting}
                            >
                              {t('Add')}
                            </Button>
                            <Glue />
                            <IconButton type="submit" disabled={submitting}>
                              <SaveIcon />
                            </IconButton>
                          </ActionsContainer>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                />
              </Table>
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
}

function Delete({ i, onDelete }: DeleteProps) {
  const { fields } = useFieldArray('petty_cash_funds', {
    subscription: { value: true },
  });
  const { id } = fields.value.at(i);

  return (
    <IconButton
      onClick={() => {
        if (id <= 0) {
          fields.remove(i);
        } else {
          onDelete(id);
        }
      }}
    >
      <DeleteIcon />
    </IconButton>
  );
}

interface DeleteProps {
  i: number;
  onDelete: (id: number) => void;
}

function usePaymentMethodsItems() {
  const payment_methods = usePaymentMethods();
  const items: Record<string, string> = {};

  payment_methods.forEach(({ id, payment_label }) => {
    items[id] = payment_label;
  });

  return items;
}

const ActionsContainer = styled.div({
  display: 'flex',
});
