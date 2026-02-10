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

export async function refreshCsrfToken() {
  const response = await fetch('/csrf-token');
  const resp = await response.json();
  // Update the meta tag in the DOM
  document
    .querySelector('meta[name="csrf-token"]')
    ?.setAttribute('content', resp.token);
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
    qz.security.setSignatureAlgorithm('SHA512');
    qz.security.setCertificatePromise((resolve: any) => {
      resolve(
        `-----BEGIN CERTIFICATE-----
MIIECzCCAvOgAwIBAgIGAZw9aUtSMA0GCSqGSIb3DQEBCwUAMIGiMQswCQYDVQQG
EwJVUzELMAkGA1UECAwCTlkxEjAQBgNVBAcMCUNhbmFzdG90YTEbMBkGA1UECgwS
UVogSW5kdXN0cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMx
HDAaBgkqhkiG9w0BCQEWDXN1cHBvcnRAcXouaW8xGjAYBgNVBAMMEVFaIFRyYXkg
RGVtbyBDZXJ0MB4XDTI2MDIwNzEzMjAzNloXDTQ2MDIwNzEzMjAzNlowgaIxCzAJ
BgNVBAYTAlVTMQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYD
VQQKDBJRWiBJbmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMs
IExMQzEcMBoGCSqGSIb3DQEJARYNc3VwcG9ydEBxei5pbzEaMBgGA1UEAwwRUVog
VHJheSBEZW1vIENlcnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCy
cRU9OXBIxwJto350zunN8Egz1tY057ja7upogwKBG0HdfnTVKpUqQJMzl6gikfdS
CyHKbVUumuI82/j+o2TMafkC4kzohRRNevNeljWDTkhMDlkJRtO2LMAy+57OppKw
dGmNaa6enTwva0O/S7HrfAlDjgQYMMvBOnqQbz0T0m+6zdotMQHJJv9+562PmmY+
32NCN5uiDLgvCSUQdr27yhtwbWoopEdaBibV2gJB4pJxquxd5q6Kcg6Ep5JlxYbv
5VqiPQ8gz9sYaG2UepbNbu7u8dHsoeIRbz+Fdvk+3XxZ0M3+6dKKQCIdIVCp8C3F
pcZbwfbrWsYltN10qRPJAgMBAAGjRTBDMBIGA1UdEwEB/wQIMAYBAf8CAQEwDgYD
VR0PAQH/BAQDAgEGMB0GA1UdDgQWBBQLL2N1iZlsDptlSKSt98rPl1WGGDANBgkq
hkiG9w0BAQsFAAOCAQEAISzC6GVyeVVSPyCm91Rd1/kdw6vaF4Syx/bXZCEE4svc
ugbt1zw9iei285p30XcBfJvYI2ld29wVvtLkZp3pgBnq/ZOyvQfrJz3E6n2sk3kD
Ok1TXVq0jMHTpjnYKwN5YEeTcbTkkqLsDIeYSkFXFyoQfA4j4TRnHlMe4nDvdKub
cP0PNlhJhvk11F0UeQgyDsd5WdSWBt0LmLsarJUr6RneeLUpddz8BM4ECDZWeUSX
YU15wKtAaInvKnUKuCreMvyf0bNWvfTxct9IfU60kq+M5LjyHtKFN3RTT3wPr9G8
QIzVhrhcIIXIU+v7XlqAKWL6yvUJqlYNxHwxab/EsA==
-----END CERTIFICATE-----`,
      );
    });
    qz.security.setSignaturePromise((toSign: any) => {
      return (resolve: any) => {
        fetch(route('sales.new_sale.sign'), {
          cache: 'no-store',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            credentials: 'include',
            'X-CSRF-TOKEN':
              _.get(
                document.querySelector('meta[name="csrf-token"]'),
                'content',
              ) || '',
          },
          body: JSON.stringify({ toSign }),
        }).then(async (resp) => {
          if (!resp.ok) {
            throw new Error('Invalid response code');
          }

          resolve(resp.text());
        });
      };
    });
    qz.security.setSignatureAlgorithm('SHA512');
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
