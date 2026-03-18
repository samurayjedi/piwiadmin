import { useTranslation } from 'react-i18next';
import { useAppPage } from '@/hooks';
import { useMemo } from 'react';
import { capabilities as CAPABILITIES } from '@/consts';
import { CrudTableProps } from '@/src/Components/CrudTable/types';

export function useFields() {
  const { t } = useTranslation();
  const fields = useMemo(() => {
    const capabilitiesSelectItems = (() => {
      const c = {} as Record<string, string>;
      CAPABILITIES.forEach((C) => {
        c[C] = t(C);
      });

      return c;
    })();
    const f: CrudTableProps['fields'] = [
      ['name', 'Label'],
      [
        'slug',
        'Slug',
        {
          type: 'textfield',
          props: (mode) => ({
            disabled: mode === 'update',
          }),
        },
      ],
      [
        'capabilities',
        'Capabilities',
        {
          type: 'select',
          props: {
            items: capabilitiesSelectItems,
            multiple: true,
          },
        },
      ],
    ];

    return f;
  }, [t]);

  return fields;
}

export function useRoles() {
  const { roles } = useAppPage().props;
  if (!roles) {
    throw new Error("Roles props it's not available in this context.");
  }

  return (roles as any).map((r: any) => ({
    ...r,
    capabilities: JSON.parse(r.capabilities),
  })) as Role[];
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  capabilities: Array<string>;
}
