import _ from 'lodash';

export default class Qz {
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
      return fetch(route('esc_pos.certificate'), {
        cache: 'no-store',
        method: 'GET',
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
      })
        .then(async (resp) => {
          if (!resp.ok) {
            throw new Error('Invalid response code');
          }

          return resp.json();
        })
        .then((json) => {
          const { certificate } = json;

          resolve(certificate);
        });
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
