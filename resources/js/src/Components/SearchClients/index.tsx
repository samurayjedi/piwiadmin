import React, { useMemo, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import Search, { SearchRef } from '@/src/lib/piwi/laboratory/Search';
import { type ClientWithRelations } from '@/Pages/Clients/types';
import { useSearchClients } from './hooks';

export default React.forwardRef<SearchClientsFieldRef, SearchClientsProps>(
  ({ onSubmit }, ref) => {
    const { t } = useTranslation();
    const sync = useAppSelector((state) => state.app.sync);
    const searchRef = useRef<SearchRef>(null);
    const [sref, retrieveRef] = useState<HTMLInputElement | null>(null);
    const { mockSubmit, submit } = useSearchClients(onSubmit);

    useImperativeHandle(ref, () => ({
      inputRef: () => sref,
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
        variant="outlined"
        items={useMemo(
          () => ({ name: t('Name'), identification: t('Identification') }),
          [t],
        )}
        onSubmit={submit}
        mockSearch={mockSubmit}
        disabled={sync !== 'ok'}
        mockSearchDisabled={(item) => item !== 'name'}
      />
    );
  },
);

export interface SearchClientsProps {
  onSubmit: (p: ClientWithRelations[]) => void;
}

export interface SearchClientsFieldRef {
  inputRef: () => HTMLInputElement | null;
  reset: () => void;
}
