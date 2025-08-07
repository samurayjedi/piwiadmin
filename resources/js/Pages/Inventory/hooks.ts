import i18next from 'i18next';
import { useAppPage } from '@/hooks';

export function useProducts() {
  const { products } = useAppPage().props;
  if (!products) {
    throw new Error(
      'For some reason, the products page props are not available.',
    );
  }

  return products;
}

export function getMeasurementSuffix(measurement: string, stock: number) {
  if (stock === 0) {
    return '';
  }

  switch (measurement) {
    case 'unit':
      if (stock > 1) {
        return i18next.t('Units');
      }
      return i18next.t('Unit');
    case 'liter':
      return stock > 1 ? 'Lts' : 'Lt';
    case 'weight':
      return 'Kg';
  }

  return undefined;
}

export function measurementNumericFormatProps(
  measurement: string,
  stock: number,
) {
  const numericFormatProps: Record<string, any> =
    measurement === 'unit'
      ? {
          allowNegative: false,
          decimalScale: 0,
        }
      : { thousandSeparator: false };
  numericFormatProps.suffix =
    measurement && ` ${getMeasurementSuffix(measurement, stock)}`;

  return numericFormatProps;
}
