import { useState, useEffect, useMemo, useCallback } from 'react';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import _ from 'lodash';
import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { createTheme } from '@mui/material/styles';
import { esES, enUS } from '@mui/material/locale';
import { route } from 'ziggy-js';

const MaterialLocales = {
  'es-ES': esES,
  'en-US': enUS,
} as const;

export function usePiwiTheme() {
  const { i18n } = useTranslation();
  const { language } = i18n;
  const themeWithLocale = useMemo(
    () =>
      createTheme(
        {
          /* palette: {
            mode: 'light',
            primary: {
              main: '#1a1a1a',
              light: '#333333',
              dark: '#000000',
            },
            secondary: {
              main: '#fdfd1f',
              light: '#00ffa2',
              dark: '#ff00f0',
            },
          },
          components: {
            MuiButton: {
              styleOverrides: {
                contained: {
                  color: '#4b4b4d',
                },
                // root: {},
              },
            },
          }, */
        },
        MaterialLocales[language as keyof typeof MaterialLocales],
      ),
    [language],
  );

  return themeWithLocale;
}

export function useErrors() {
  const { errors } = usePage().props;
  const [fuckErrors, setFuckErrors] = useState(errors);

  useEffect(() => {
    setFuckErrors(errors);
  }, [errors]);

  const removeError = (key: string) =>
    setFuckErrors((prev) => _.omit(prev, key));

  const onChangeDecorator =
    (onChange: (vacaEv: unknown, ...vacaArgs: unknown[]) => void) =>
    (ev: unknown, ...args: unknown[]) => {
      onChange(ev, ...args);
      const name = _.get(ev, 'target.name', null) as string | null;
      if (name) {
        if (_.has(fuckErrors, name)) {
          removeError(name);
        }
      }
    };

  return [fuckErrors, onChangeDecorator, removeError] as const;
}

/** No works with input type file!!!! */
export function useSubmitHandler(link: string) {
  const callback = useCallback(
    (data: Record<string, any>) =>
      new Promise<void>((resolve) =>
        router.post(route(link), data, {
          onFinish: () => resolve(),
        }),
      ),
    [link],
  );

  return callback;
}

export function useSuperSubmitHandler(link: string) {
  const callback = useCallback(
    (data: Record<string, any>) =>
      new Promise<void>((resolve) => {
        const formData = new FormData();
        let haveFiles = false;
        /** i make it a function for recursively append objects */
        function appendToFormData(value: any, key: string) {
          if (Array.isArray(value) || typeof value === 'object') {
            _.forEach(value, (v, index) => {
              const k = `${key}[${index}]`;
              if (Array.isArray(v) || typeof v === 'object') {
                appendToFormData(v, k);
              } else {
                formData.append(k, v);
              }
            });
          } else {
            formData.append(key, value);
          }
        }
        _.forEach(data, (value: any, key) => {
          /** if the key is a input type file name, append the files selected */
          if (typeof value === 'string') {
            const fields = document.getElementsByName(key);
            const el: HTMLInputElement | null = fields[0] as HTMLInputElement;
            if (el && el.files) {
              const isMultiple = el.hasAttribute('multiple');
              if (isMultiple) {
                for (let i = 0; i < el.files.length; i++) {
                  formData.append(`${key}[]`, el.files[i]);
                }
              } else {
                formData.append(key, el.files[0]);
              }

              haveFiles = true;
              return;
            }
          }
          /** otherwise, append normally */
          appendToFormData(value, key);
        });

        router.post(route(link), formData, {
          onFinish: () => resolve(),
          forceFormData: haveFiles,
        });
      }),
    [link],
  );

  return callback;
}

export function useRffCheckOnChange() {
  const [, , removeError] = useErrors();

  return (fields: RffFields) => (ev: unknown) => {
    removeError(fields.name);
    const checked = _.get(ev, 'target.checked', false) as boolean;
    const value = _.get(ev, 'target.value', '') as string;
    if (checked) {
      fields.push(value);
    } else {
      fields.remove(fields.value.indexOf(value));
    }
  };
}

type RffFields = FieldArrayRenderProps<any, HTMLElement>['fields'];
