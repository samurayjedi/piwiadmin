import { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Collapse,
  Tabs,
  Tab as MUITab,
  Slide,
  Typography,
  Box,
} from '@mui/material';
import SoapIcon from '@mui/icons-material/Soap';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import { useAppSelector } from '@/store/hooks';
import UserInfo from './UserInfo';
import { getMeasurementSuffix } from '../Inventory/hooks';

export default function SaleTableRow({
  onPay,
  onClientClick,
  ...sale
}: SaleTableRowProps) {
  const { t } = useTranslation();
  const dolar = useAppSelector((s) => s.currencies.dolar);
  const sync = useAppSelector((state) => state.app.sync);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  return (
    <>
      <TableRow>
        <TableCell>
          <Button
            variant="text"
            color="primary"
            startIcon={!open ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            onClick={() => setOpen((prev) => !prev)}
          >
            #{sale.id}
          </Button>
        </TableCell>
        <TableCell>{sale.created_at}</TableCell>
        <TableCell align="center">
          <Button
            variant="text"
            size="small"
            color="primary"
            onClick={onClientClick}
          >
            {sale.client.name}
          </Button>
        </TableCell>
        <TableCell>
          <UserInfo user={sale.user} />
        </TableCell>
        <TableCell>{t(sale.payment_type)}</TableCell>
        <TableCell>
          <LabelDolarBs value={sale.total_amount} />
        </TableCell>
        <TableCell>
          <LabelDolarBs
            value={Math.max(0, sale.total_amount - sale.amount_paid)}
          />
        </TableCell>
        <TableCell>
          <Button
            variant="text"
            size="small"
            color={(() => {
              switch (sale.status) {
                case 'canceled':
                  return 'error';
                case 'completed':
                  return 'success';
              }

              return 'warning';
            })()}
          >
            {sale.status}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <CollapsibleCell colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Wrapper>
              <Tabs
                value={index}
                onChange={(event, newValue: number) => {
                  setDirection(newValue > index ? 'left' : 'right');
                  setIndex(newValue);
                }}
              >
                <Tab label={t('Purchase')} />
                <Tab label={t('Payments made')} />
              </Tabs>
              <Slide
                in={index === 0}
                mountOnEnter
                unmountOnExit
                direction={direction}
                timeout={300}
              >
                <SlideableTable size="small" active={index === 0}>
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
                        <TableCell>
                          {item.product.category.category_label}
                        </TableCell>
                        <TableCell>
                          {`${item.unit_price.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}`}
                          {sync === 'ok' &&
                            ` (${(item.unit_price * dolar).toLocaleString(
                              'es-VE',
                              {
                                style: 'currency',
                                currency: 'VES',
                              },
                            )})`}
                        </TableCell>
                        <TableCell>{`${item.quantity} ${getMeasurementSuffix(item.product.measurement, item.quantity)}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </SlideableTable>
              </Slide>
              <Slide
                in={index === 1}
                mountOnEnter
                unmountOnExit
                direction={direction}
                timeout={300}
              >
                <SlideableTable size="small" active={index === 1}>
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
                            {p.amount.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            })}
                            {sync === 'ok' &&
                              ` (${(p.amount * dolar).toLocaleString('es-VE', {
                                style: 'currency',
                                currency: 'VES',
                              })})`}
                          </TableCell>
                          <TableCell>
                            {p.payment_method.payment_label}
                          </TableCell>
                          <TableCell>{p.notes}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </SlideableTable>
              </Slide>
              <Footer>
                {sale.notes !== 'null' ? (
                  <Typography variant="caption" sx={{ flex: 1 }}>
                    <strong>{t('Sale notes')}:</strong>&nbsp;
                    {sale.notes}
                  </Typography>
                ) : (
                  <Box sx={{ flex: 1 }} />
                )}
                {sale.payment_type !== 'cash' && sale.status === 'pending' && (
                  <Button
                    size="small"
                    variant="text"
                    color="warning"
                    startIcon={<SoapIcon />}
                    onClick={onPay}
                    disabled={sync !== 'ok'}
                  >
                    {t('Payment')}
                  </Button>
                )}
                <Button
                  size="small"
                  variant="text"
                  color="primary"
                  startIcon={<ReceiptLongIcon />}
                  onClick={() =>
                    window.open(
                      route('sales.sale.print_invoice', { id: sale?.id ?? 0 }),
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                >
                  {t('Print Invoice')}
                </Button>
              </Footer>
            </Wrapper>
          </Collapse>
        </CollapsibleCell>
      </TableRow>
    </>
  );
}

export interface SaleTableRowProps extends SalesPageProps {
  onPay: () => void;
  onClientClick: () => void;
}

const CollapsibleCell = styled(TableCell)({
  paddingTop: 0,
  paddingBottom: 0,
});

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: theme.spacing(1),
}));

const Footer = styled.div(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(1),
  alignItems: 'center',
}));

const SlideableTable = styled(Table)<{ active: boolean }>(({ active }) => ({
  display: active ? 'table' : 'none',
}));

const Tab = styled(MUITab)({
  fontSize: 12,
  textTransform: 'initial',
});
