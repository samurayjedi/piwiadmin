import { route as ziggyRoute } from 'ziggy-js';
import type { Theme as MUITheme } from '@mui/material/styles';

// merge @mui theme type with @emotion theme type
declare module '@emotion/react' {
  export interface Theme extends MUITheme {}
}

declare global {
  const route: typeof ziggyRoute; // use route whithout import
  interface FormData {
    entries(): IterableIterator<[string, FormDataEntryValue]>;
  }
  /** this app only */
  type Language = 'es-ES' | 'en-US';
  /** unique in sales (main) page */

  /** */
  interface AppPageProps {
    props: {
      auth: {
        user: User;
      };
    };
  }

  interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
  }
}
