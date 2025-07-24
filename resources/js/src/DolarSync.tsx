import React, { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateDolarPrice } from '@/store/currencies';

export default function DolarSync({ children }: DolarSyncProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateDolarPrice());
  }, []);

  return children;
}

export interface DolarSyncProps {
  children: React.ReactNode;
}
