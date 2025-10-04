import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const updateDolarPrice = createAsyncThunk(
  'currencies/updateDolarPrice',
  async (_, { dispatch, fulfillWithValue }) => {
    const resp = await fetch(route('update-dolar-price'), {
      method: 'GET',
      mode: 'same-origin',
    });

    if (!resp.ok) {
      return fulfillWithValue(resp.status);
    }

    const responseData = await resp.json();
    dispatch(setDolarPrice(responseData.dolar));

    return fulfillWithValue(0);
  },
);

const initialState: CurrenciesState = { dolar: 0, dialogOpen: false };
export const slice = createSlice({
  name: 'currencies',
  initialState,
  reducers: {
    toogleDialog: (state) => {
      state.dialogOpen = !state.dialogOpen;
    },
    setDolarPrice: (state, action: PayloadAction<number>) => {
      const newPrice = action.payload;
      state.dolar = newPrice;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateDolarPrice.fulfilled, (state, action) => {
      if (action.payload !== 0) {
        state.dialogOpen = true;
      }
    });
  },
});

export const { setDolarPrice, toogleDialog } = slice.actions;
export default slice.reducer;

export interface CurrenciesState {
  dialogOpen: boolean;
  dolar: number;
}
