import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import i18nTranslator from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import BrowserLanguageDetector from 'i18next-browser-languagedetector';
import LocalesResourcesBackend from 'i18next-http-backend';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import store from './store';
// fonts required by mui
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// continue with internal dependencies....
import { usePiwiTheme } from './hooks';
import { locales } from './src/lib/piwi/dateFnsFacade';
import '../css/app.css';

i18nTranslator
  .use(initReactI18next)
  .use(BrowserLanguageDetector)
  .use(LocalesResourcesBackend)
  .init({
    fallbackLng: 'en-ES',
    supportedLngs: ['en-US', 'es-ES'],
    interpolation: {
      escapeValue: false,
    },
  });

createInertiaApp({
  resolve: async (name) => {
    const Page = (await import(`./Pages/${name}`)).default;

    if (!Page) {
      throw new Error(`${name} not exists!!!`);
    }

    return Page;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <Piwi>
        <App {...props} />
      </Piwi>,
    );
  },
  progress: {
    color: '#4B5563',
  },
});

function Piwi({ children }: { children: React.ReactNode }) {
  const theme = usePiwiTheme();
  const {
    i18n: { language },
  } = useTranslation();
  const locale = locales[language as keyof typeof locales];

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={locale}
        >
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}
