import React, { useMemo, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import Search, { SearchRef } from '@/src/lib/piwi/laboratory/Search';
import { type Product } from '@/Pages/Inventory/types';
import { useRequestFocus, useSearchProducts } from './hooks';

export default React.forwardRef<SearchProductsFieldRef, SearchProductsProps>(
  ({ onSubmit, variant = 'filled' }, ref) => {
    const { t } = useTranslation();
    const sync = useAppSelector((state) => state.app.sync);
    const searchRef = useRef<SearchRef>(null);
    const [inputRef, retrieveRef] = useRequestFocus(sync);
    const { mockSubmit, submit } = useSearchProducts(onSubmit);

    useImperativeHandle(ref, () => ({
      inputRef: () => inputRef,
      reset: () => {
        if (searchRef.current) {
          searchRef.current.reset();
        }
      },
    }));

    return (
      <Search
        ref={searchRef}
        inputRef={retrieveRef}
        name="field"
        label={t('Search')}
        variant={variant}
        items={useMemo(() => ({ name: t('Name'), barcode: t('Barcode') }), [t])}
        onSubmit={submit}
        mockSearch={mockSubmit}
        disabled={sync !== 'ok'}
        mockSearchDisabled={(item) => item !== 'name'}
      />
    );
  },
);

export interface SearchProductsProps {
  variant?: 'standard' | 'outlined' | 'filled';
  onSubmit: (p: Product[]) => void;
}

export interface SearchProductsFieldRef {
  inputRef: () => HTMLInputElement | null;
  reset: () => void;
}
