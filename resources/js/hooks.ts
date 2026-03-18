import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { createTheme } from '@mui/material/styles';
import { esES, enUS } from '@mui/material/locale';

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

export function useAppPage() {
  const page = usePage();

  return page as typeof page & AppPageProps;
}

export function useErrors() {
  const { errors } = useAppPage().props;
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

export function useUser() {
  const { user } = useAppPage().props.auth;
  if (!user) {
    throw new Error("The user itt's not logged.");
  }

  return user;
}

export function usePaginatorProps() {
  const { count, page, rows } = useAppPage().props;
  if (count === undefined || page === undefined || rows === undefined) {
    throw new Error(
      'This page uses a paginator, but the required props are not available.',
    );
  }

  return {
    count,
    page,
    rows,
  } as {
    page: number;
    count: number;
    rows: number;
  };
}

export async function refreshCsrfToken() {
  const response = await fetch('/csrf-token');
  const resp = await response.json();
  // Update the meta tag in the DOM
  document
    .querySelector('meta[name="csrf-token"]')
    ?.setAttribute('content', resp.token);
}
