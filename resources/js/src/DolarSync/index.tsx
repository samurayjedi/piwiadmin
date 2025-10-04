import React, { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateDolarPrice } from '@/store/currencies';
import UpdateDolarPriceDialog from './UpdateDolarPriceDialog';

export default function DolarSync({ children }: DolarSyncProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateDolarPrice());
  }, []);

  return (
    <>
      {children}
      <UpdateDolarPriceDialog />
    </>
  );
}

export interface DolarSyncProps {
  children: React.ReactNode;
}
