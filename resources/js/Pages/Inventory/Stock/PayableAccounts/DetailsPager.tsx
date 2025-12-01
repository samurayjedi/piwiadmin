import React from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  TableCell,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Button,
} from '@mui/material';
import SoapIcon from '@mui/icons-material/Soap';
import TabsPager from '@/src/lib/piwi/animated/TabsPager';
import LabelDolarBs from '@/src/Components/LabelDolarBs';
import { useAppSelector } from '@/store/hooks';
import Glue from '@/src/lib/piwi/common/Glue';
import { getMeasurementSuffix } from '../../hooks';
import { PayableAccount } from './hooks';

function DetailsPager({ onPay, ...payableAccount }: DetailsPagerProps) {
  const { t } = useTranslation();
  const sync = useAppSelector((state) => state.app.sync);

  return (
    <Content>
      <TabsPager
        tabSize="small"
        tabs={{
          purchase: t('Products'),
          payments_made: t('Payments made'),
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('Barcode')}</TableCell>
              <TableCell>{t('Name')}</TableCell>
              <TableCell>{t('Brand')}</TableCell>
              <TableCell>{t('Category')}</TableCell>
              <TableCell>{t('Quantity')}</TableCell>
              <TableCell>{t('Unit price')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payableAccount.items.map((item, i) => (
              <TableRow key={`payable-account-product-${item.id}`}>
                <TableCell>{item.product.barcode}</TableCell>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.brand.brand_label}</TableCell>
                <TableCell>{item.product.category.category_label}</TableCell>
                <TableCell>
                  {`${payableAccount.stock_log.products[i].pivot.adjustment} ${getMeasurementSuffix(item.product.measurement, payableAccount.stock_log.products[i].pivot.adjustment)}`}
                </TableCell>
                <TableCell>
                  <LabelDolarBs variant="horizontal" value={item.unit_price} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{t('Done on')}</TableCell>
              <TableCell>{t('Amount')}</TableCell>
              <TableCell>{t('Note')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!payableAccount.payments.length ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {t('No payments have been made')}
                </TableCell>
              </TableRow>
            ) : (
              payableAccount.payments.map((p) => (
                <TableRow key={`payable-account-payment-${p.id}`}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.created_at}</TableCell>
                  <TableCell>
                    <LabelDolarBs value={p.amount} variant="horizontal" />
                  </TableCell>
                  <TableCell>{p.notes}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TabsPager>
      <Footer>
        <Glue />
        {payableAccount.status !== 'completed' && (
          <Button
            size="small"
            variant="text"
            color="warning"
            startIcon={<SoapIcon />}
            disabled={sync !== 'ok'}
            onClick={() => onPay(payableAccount.id)}
          >
            {t('Payment')}
          </Button>
        )}
      </Footer>
    </Content>
  );
}

export default React.memo(DetailsPager, _.isEqual);

export interface DetailsPagerProps extends PayableAccount {
  onPay: (id: number) => void;
}

const Content = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginTop: -8,
});

const Footer = styled.div(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(1),
  alignItems: 'center',
}));
