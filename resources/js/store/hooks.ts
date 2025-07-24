import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

import type { RootState, AppDispatch } from '.';

export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
