import { route as ziggyRoute } from 'ziggy-js';
import type { Theme as MUITheme } from '@mui/material/styles';

// merge @mui theme type with @emotion theme type
declare module '@emotion/react' {
  export interface Theme extends MUITheme {}
}

declare global {
  const route: typeof ziggyRoute;
  export type Language = 'es-ES' | 'en-US';
  export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
  > = T & {
    auth: {
      user: User;
    };
  };
  interface FormData {
    entries(): IterableIterator<[string, FormDataEntryValue]>;
  }
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
}
