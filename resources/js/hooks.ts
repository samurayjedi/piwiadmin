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

export class Qz {
  public static version = 0;

  private static getInstance() {
    const qz = _.get(window, 'qz', null) as any;
    if (!qz) {
      throw new Error('Qz tray no available!!!');
    }

    return qz;
  }

  static startConnection(host: string, usingSecure: boolean) {
    const qz = Qz.getInstance();
    // Connect to a print-server instance, if specified
    const config = { host, usingSecure, retries: 5, delay: 1 };

    return new Promise<void>((resolve, reject) => {
      if (!qz.websocket.isActive()) {
        qz.websocket
          .connect(config)
          .then(() => {
            qz.api
              .getVersion()
              .then((data: any) => {
                Qz.version = data;
                resolve();
              })
              .catch(reject);
          })
          .catch(reject);
      }
    });
  }

  static findPrinters() {
    return new Promise<string[]>((resolve, reject) => {
      Qz.getInstance()
        .printers.find()
        .then((printerList: any[]) => {
          if (!printerList.length) {
            throw new Error('No printers found!!');
          }
          resolve(printerList);
        })
        .catch(reject);
    });
  }

  static print(fileUrl: string, printer: string) {
    return new Promise<void>((resolve, reject) => {
      fetch(fileUrl)
        .then((response) => {
          response
            .arrayBuffer()
            .then((arrayBuffer: any) => {
              const config = Qz.getInstance().configs.create(printer);
              const base64Data = btoa(
                new Uint8Array(arrayBuffer).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  '',
                ),
              );
              const data = [
                {
                  type: 'raw',
                  format: 'command',
                  flavor: 'base64',
                  data: base64Data,
                },
              ];

              Qz.getInstance()
                .print(config, data)
                .then(() => {
                  resolve();
                })
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  static endConnection() {
    const qz = Qz.getInstance();

    return new Promise<void>((resolve) => {
      if (qz.websocket.isActive()) {
        qz.websocket.disconnect().then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
