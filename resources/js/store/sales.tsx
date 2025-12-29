import { router } from '@inertiajs/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { VisitOptions } from '@inertiajs/core';
import { SalesPageProps } from '@/Pages/Sales/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

const initialState: SaleaState = {
  pay_dialog_open: false,
  void_invoice_dialog_open: false,
  sale: undefined,
};

export const voidInvoiceAction = createAsyncThunk<
  void,
  Exclude<VisitOptions, 'method'>
>('sales/void_invoice', async ({ ...opts }, { getState }) => {
  const { sale } = (getState() as RootState).sales as SaleaState;

  return new Promise<void>((resolve, reject) =>
    router.post(
      route('sales.void_invoice', { id: sale?.id ?? 0 }),
      {},
      {
        ...opts,
        onSuccess: (x) => {
          if (opts.onSuccess) {
            opts.onSuccess(x);
          }
          resolve();
        },
        onError: (x) => {
          if (opts.onError) {
            opts.onError(x);
          }
          reject();
        },
      },
    ),
  );
});

export const slice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    onPay: (state, action: PayloadAction<SalesPageProps>) => {
      state.pay_dialog_open = true;
      state.sale = action.payload;
    },
    closePayDialog: (state) => {
      state.pay_dialog_open = false;
      state.sale = undefined;
    },
    voidInvoice: (state, action: PayloadAction<SalesPageProps>) => {
      state.void_invoice_dialog_open = true;
      state.sale = action.payload;
    },
    closeVoidInvoce: (state) => {
      state.void_invoice_dialog_open = false;
      state.sale = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(voidInvoiceAction.fulfilled, (state) => {
      state.void_invoice_dialog_open = false;
      state.sale = undefined;
    });
  },
});

export const { onPay, closePayDialog, voidInvoice, closeVoidInvoce } =
  slice.actions;
export default slice.reducer;

export interface SaleaState {
  pay_dialog_open: boolean;
  void_invoice_dialog_open: boolean;
  sale: SalesPageProps | undefined;
}
