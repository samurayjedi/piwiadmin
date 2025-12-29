import { createSlice } from '@reduxjs/toolkit';

const initialState: NewSaleState = {
  searchProductDialogOpen: true,
  payDialogOpen: false,
  dialOpen: false,
};
export const slice = createSlice({
  name: 'new_sale',
  initialState,
  reducers: {
    openSearchProductDialog: (state) => {
      state.searchProductDialogOpen = true;
    },
    closeSearchProductDialog: (state) => {
      state.searchProductDialogOpen = false;
    },
    openPayDialog: (state) => {
      state.payDialogOpen = true;
    },
    closePayDialog: (state) => {
      state.payDialogOpen = false;
    },
    openDial: (state) => {
      state.dialOpen = true;
    },
    closeDial: (state) => {
      state.dialOpen = false;
    },
    toggleDial: (state) => {
      state.dialOpen = !state.dialOpen;
    },
  },
});

export const {
  openSearchProductDialog,
  closeSearchProductDialog,
  openPayDialog,
  closePayDialog,
  openDial,
  closeDial,
  toggleDial,
} = slice.actions;
export default slice.reducer;

export interface NewSaleState {
  searchProductDialogOpen: boolean;
  payDialogOpen: boolean;
  dialOpen: boolean;
}
