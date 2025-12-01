import { useCallback, useRef, useState } from 'react';
import _ from 'lodash';
import { FormProps } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import SearchError from './SearchError';
import { type MockSearchForwardedRef, type MockSearchProps } from './TextField';
import { type SearchProps } from '.';

export function useSearchFetch(action: string) {
  const { t } = useTranslation();
  const controller = useRef<AbortController | null>(null);

  return useCallback(
    (field: string, value: string) => {
      /** onBefore */
      if (controller.current !== null) {
        controller.current.abort();
      }
      controller.current = new AbortController();

      return fetch(route(`${action}.${field}`, { [field]: value }), {
        signal: controller.current.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN':
            _.get(
              document.querySelector('meta[name="csrf-token"]'),
              'content',
            ) || '',
        },
      })
        .then(async (resp) => {
          if (!resp.ok) {
            throw new SearchError({
              [field]: t('Error conecting/receiving, try again.'),
            });
          }

          return resp.json();
        })
        .then(async (json: Record<string, any>) => {
          controller.current = null;
          if (json.status === 0) {
            throw new SearchError(json.errors);
          }

          return json;
        })
        .catch(async (err) => {
          // catch the error only when itsn't caused by AbortController.abort()
          if (err.name === 'AbortError') {
            return null;
          }

          throw err;
        });
    },
    [action, t],
  );
}

export function useSearchErrors(
  ref: React.RefObject<MockSearchForwardedRef>,
  name: string,
  onSubmit: SearchProps['onSubmit'],
  mockSearch: SearchProps['mockSearch'],
) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitFacade = useCallback<FormProps['onSubmit']>(
    (data) => {
      if (ref.current) {
        ref.current.emptyResults();
      }
      if (onSubmit) {
        const namae = data[name];
        const value = data[namae];

        return new Promise<any>((resolve) => {
          onSubmit(namae, value)
            .then((r) => {
              setErrors({});
              resolve(r);
            })
            .catch((error: SearchError) => {
              setErrors(error.errors);
              resolve([]);

              return null;
            });
        });
      }

      return new Promise<void>((resolve) => {
        resolve();
      });
    },
    [name, onSubmit],
  );

  const mockSearchFacade = useCallback<MockSearchProps['mockSearch']>(
    (s) =>
      new Promise<any>((resolve) => {
        mockSearch(s)
          .then((r) => {
            setErrors({});
            resolve(r);
          })
          .catch((error: SearchError) => {
            setErrors(error.errors);
            resolve([]);

            return null;
          });
      }),
    [mockSearch],
  );

  return { errors, submitFacade, mockSearchFacade };
}

export interface SearchFetchAttrs {
  submitAction: string;
  inputRef: HTMLInputElement | null;
  sRoute: string;
  routeAttrs: Record<string, any>;
}
