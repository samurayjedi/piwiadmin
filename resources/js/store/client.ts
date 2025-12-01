import { router } from '@inertiajs/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { VisitOptions } from '@inertiajs/core';
import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { type RootState } from '.';

const initialState: ClientStoreState = { id: -1 };
export const slice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    clientAction: (state, pAction: PayloadAction<[number, RecordAction]>) => {
      const [id, action] = pAction.payload;
      state.id = id;
      state.action = action;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clientActionSubmit.fulfilled, (state) => {
      state.id = -1;
      state.action = undefined;
    });
    builder.addCase(clientDeleteAction.fulfilled, (state) => {
      state.id = -1;
      state.action = undefined;
    });
  },
});

export const { clientAction } = slice.actions;
export default slice.reducer;

export const clientActionSubmit = createAsyncThunk<
  void,
  Exclude<VisitOptions, 'method'>
>('client/client_action_submit', async ({ data, ...opts }, { getState }) => {
  const { id, action } = (getState() as RootState).client as ClientStoreState;

  return new Promise<void>((resolve, reject) => {
    const url =
      action === 'add'
        ? route('clients.store')
        : route('clients.update', { id });

    router.post(url, data, {
      ...opts,
      onSuccess: (x) => {
        if (opts.onSuccess) {
          opts.onSuccess(x);
        }
        resolve();
      },
      onError: (errs) => {
        if (opts.onError) {
          opts.onError(errs);
        }
        reject();
      },
    });
  });
});

export const clientDeleteAction = createAsyncThunk<
  void,
  Exclude<VisitOptions, 'method'>
>('client/client_action_delete', async ({ ...opts }, { getState }) => {
  const { id } = (getState() as RootState).client as ClientStoreState;

  return new Promise<void>((resolve) =>
    router.post(
      route('clients.delete', { id }),
      {},
      {
        ...opts,
        onFinish: (x) => {
          if (opts.onFinish) {
            opts.onFinish(x);
          }
          resolve();
        },
      },
    ),
  );
});

export interface ClientStoreState {
  id: number;
  action?: RecordAction;
}

type RecordAction = 'add' | 'edit' | 'delete' | undefined;
