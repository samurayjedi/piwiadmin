import { useAppPage } from '@/hooks';
import { PaymentMethod } from '../PaymentMethods/types';

export function usePaydesk() {
  const page = useAppPage();
  const { paydesk } = page.props;
  if (!paydesk) {
    throw new Error('Paydesk data not available in this context!!.');
  }

  return paydesk as Paydesk;
}

export function useInitialFunds() {
  const paydesk = usePaydesk();
  if (paydesk.session && !paydesk.session.user_id) {
    const amounts: Amount[] = [
      ...paydesk.session.openings.map((p) => ({
        amount: p.amount,
        payment_method_id: p.payment_method_id,
        payment_method: p.payment_method,
      })),
    ];
    const lastCut = paydesk.session.cuts.at(0) as PaydeskPartialCut;
    lastCut.amounts.forEach((amount) => {
      let incremented = false;
      for (let i = 0; i < amounts.length; i++) {
        if (amounts[i].payment_method_id === amount.payment_method_id) {
          amounts[i].amount += amount.amount;
          incremented = true;
        }
      }
      if (!incremented) {
        amounts.push({
          amount: amount.amount,
          payment_method_id: amount.payment_method_id,
          payment_method: amount.payment_method,
        });
      }
    });

    return amounts;
  }
  const amounts: Amount[] = [
    ...paydesk.petty_cash_funds.map((p) => ({
      amount: p.amount,
      payment_method_id: p.payment_method_id,
      payment_method: p.payment_method,
    })),
  ];

  return amounts;
}

export interface Paydesk {
  id: number;
  name: string;
  location: string;
  active: boolean;
  session: PaydeskSession | null;
  petty_cash_funds: PettyCashFund[];
}

export interface PettyCashFund {
  id: number;
  paydesk_id: number;
  payment_method_id: number;
  payment_method: PaymentMethod;
  amount: number;
}

export interface PaydeskSession {
  id: number;
  user_id: number | null;
  user: User | null;
  open_at: string;
  closed_at: string;
  status: 'open' | 'close';
  openings: PaydeskOpenings[];
  closures: PaydeskClosures[];
  cuts: PaydeskPartialCut[];
}

export interface PaydeskOpenings {
  id: number;
  paydesk_session_id: number;
  payment_method_id: number;
  amount: number;
  payment_method: PaymentMethod;
}

export interface PaydeskClosures {
  id: number;
  paydesk_session_id: number;
  payment_method_id: number;
  amount: number;
  payment_method: PaymentMethod;
}

export interface PaydeskPartialCut {
  id: number;
  paydesk_session_id: number;
  user_id: number;
  note: string | null;
  escpos_invoice_path: string | null;
  amounts: PaydeskPartialCutAmount[];
}

export interface PaydeskPartialCutAmount {
  id: number;
  paydesk_partial_cut_id: number;
  payment_method_id: number;
  amount: number;
  payment_method: PaymentMethod;
}

export interface Amount {
  amount: number;
  payment_method_id: number;
  payment_method: PaymentMethod;
}
