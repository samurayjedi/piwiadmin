import i18next from 'i18next';
import {
  format as datefnsFormat,
  parse as datefnsParse,
  addDays,
  addWeeks,
  addMonths,
  addYears,
} from 'date-fns';
import enUSLocale from 'date-fns/locale/en-US';
import esESLocale from 'date-fns/locale/es';

export const locales = {
  'en-US': enUSLocale,
  'es-ES': esESLocale,
} as const;

export const dateFormats = {
  'en-US': 'yyyy-MM-dd',
  'es-ES': 'dd-MM-yyyy',
};

export const dateTimeFormats = {
  'en-US': 'yyyy-MM-dd hh:mm aaaa',
  'es-ES': 'dd-MM-yyyy hh:mm aaaa',
};

function language() {
  const l = i18next.language;
  if (l !== 'en-US' && l !== 'es-ES') {
    throw new Error(`Invalid language ${l}.`);
  }

  return l;
}

export function format(date: Date, sf?: string) {
  const f = sf ?? dateFormats[language()];

  return datefnsFormat(date, f, {
    locale: locales[language()],
  } as any);
}

export function parse(date: string, sf?: string, ref: Date = new Date()) {
  const f = sf ?? dateFormats[language()];

  return datefnsParse(date, f, ref, {
    locale: locales[language()],
  } as any);
}

export function addDate(date: Date, period: string) {
  const normalizedPeriod = period.toLowerCase().trim();

  if (normalizedPeriod.includes('day')) {
    const days =
      parseInt(period, 10) || (normalizedPeriod.includes('tomorrow') ? 1 : 0);

    return addDays(date, days);
  }
  if (normalizedPeriod.includes('week')) {
    const weeks = parseInt(period, 10) || 1;

    return addWeeks(date, weeks);
  }
  if (normalizedPeriod.includes('month')) {
    const months =
      parseInt(period, 10) || (normalizedPeriod.includes('two') ? 2 : 1);

    return addMonths(date, months);
  }
  if (normalizedPeriod.includes('year')) {
    const years = parseInt(period, 10) || 1;

    return addYears(date, years);
  }

  return date;
}
