import { useCallback, useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  TableCell,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Button,
  IconButton,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import SoapIcon from '@mui/icons-material/Soap';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CommentIcon from '@mui/icons-material/Comment';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import BlockIcon from '@mui/icons-material/Block';
import TabsPager from '@/src/lib/piwi/animated/TabsPager';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import IconButtonDropdown from '@/src/lib/piwi/core/IconButtonDropdown';
import Popper from '@/src/lib/piwi/core/Popper';
import { onPay, voidInvoice } from '@/store/sales';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { type SalesPageProps } from './types';
import { getMeasurementSuffix } from '../Inventory/hooks';

export default function TableCellsSaleDetails({
  ...sale
}: TableCellsSaleDetailsProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sync = useAppSelector((state) => state.app.sync);

  return (
    <Content>
      <TabsPager
        tabSize="small"
        tabsPosition="bottom"
        tabs={{
          purchase: t('Purchase'),
          payments_made: t('Payments made'),
        }}
        additional={
          <>
            {sale.notes !== 'null' && sale.notes !== null && (
              <SaleNotes note={sale.notes} />
            )}
            {sale.status !== 'canceled' && (
              <IconButton
                color="error"
                size="small"
                title={t('Void invoice')}
                sx={{ mr: 1 }}
                onClick={() => dispatch(voidInvoice(sale))}
              >
                <BlockIcon fontSize="small" />
              </IconButton>
            )}
            {sale.status === 'canceled' &&
              sale.sale_items.filter((v) => !v.product.deleted_at).length && (
                <IconButton
                  title={t('Replicate invoice')}
                  size="small"
                  color="default"
                  sx={{ mr: 1 }}
                  onClick={() =>
                    router.post(route('sales.new_sale'), {
                      cart: sale.sale_items.map((item) => ({
                        id: item.product_id,
                        qty: item.quantity,
                      })),
                    })
                  }
                >
                  <CopyAllIcon fontSize="small" />
                </IconButton>
              )}
            {sale.payment_type !== 'cash' && sale.status === 'pending' && (
              <Button
                size="small"
                variant="text"
                color="warning"
                startIcon={<SoapIcon />}
                onClick={() => dispatch(onPay(sale))}
                disabled={sync !== 'ok'}
              >
                {t('Payment')}
              </Button>
            )}
            <IconButtonDropdown
              icon={<ReceiptIcon />}
              title={t('Print Invoice')}
              color="primary"
            >
              <List dense>
                <ListItemButton>
                  <ListItemText
                    primary={t('Digital')}
                    onClick={() =>
                      window.open(
                        route('sales.sale.print_invoice', {
                          id: sale?.id ?? 0,
                        }),
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                  />
                </ListItemButton>
                {sale.escpos_invoice_path && (
                  <ListItemButton
                    LinkComponent={Link}
                    href={route('sales.sale.print_esc_eos_invoice', {
                      file: btoa(sale.escpos_invoice_path),
                    })}
                  >
                    <ListItemText primary={t('Ticket')} />
                  </ListItemButton>
                )}
              </List>
            </IconButtonDropdown>
          </>
        }
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('Barcode')}</TableCell>
              <TableCell>{t('Name')}</TableCell>
              <TableCell>{t('Brand')}</TableCell>
              <TableCell>{t('Category')}</TableCell>
              <TableCell>{t('Sale price')}</TableCell>
              <TableCell>{t('Qty')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sale.sale_items.map((item) => (
              <TableRow key={`purchased-item-row-${item.id}`}>
                <TableCell>{item.product.barcode}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.brand.brand_label}</TableCell>
                <TableCell>{item.product.category.category_label}</TableCell>
                <TableCell>
                  <LabelDolarBs value={item.unit_price} variant="horizontal" />
                </TableCell>
                <TableCell>{`${item.quantity} ${getMeasurementSuffix(item.product.measurement, item.quantity)}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{t('Date')}</TableCell>
              <TableCell>{t('Amount')}</TableCell>
              <TableCell>{t('Payment method')}</TableCell>
              <TableCell>{t('Note')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!sale.payments.length ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {t('No payments have been made')}
                </TableCell>
              </TableRow>
            ) : (
              sale.payments.map((p) => (
                <TableRow key={`payment-row-${p.id}`}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.payment_date}</TableCell>
                  <TableCell>
                    <LabelDolarBs value={p.amount} variant="horizontal" />
                  </TableCell>
                  <TableCell>{p.payment_method.payment_label}</TableCell>
                  <TableCell>{p.notes}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TabsPager>
    </Content>
  );
}

export interface TableCellsSaleDetailsProps extends SalesPageProps {}

function SaleNotes({ note }: { note: string }) {
  const { t } = useTranslation();
  const popoverId = useMemo(() => _.uniqueId('popover-notification_'), []);
  const [noteAnchor, setNoteAnchor] = useState<HTMLElement | null>(null);

  const onClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setNoteAnchor(event.currentTarget);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setNoteAnchor(null);
  }, []);

  return (
    <>
      <IconButton
        title={t('Note')}
        onClick={onClick}
        size="small"
        color="default"
        sx={{ mr: 1 }}
      >
        <CommentIcon fontSize="small" />
      </IconButton>
      <Popper
        id={popoverId}
        open={noteAnchor !== null}
        anchorEl={noteAnchor}
        placement="bottom"
      >
        <ClickAwayListener onClickAway={handlePopoverClose}>
          <NoteContent>{note}</NoteContent>
        </ClickAwayListener>
      </Popper>
    </>
  );
}

const Content = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginTop: -8,
});

const NoteContent = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: theme.spacing(2),
  maxWidth: 300,
}));
