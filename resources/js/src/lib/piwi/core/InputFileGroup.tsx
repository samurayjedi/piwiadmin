import React, { createContext } from 'react';
import { Typography } from '@mui/material';

export const MultipleInputFileContext = createContext<Omit<
  InputFileGroupProps,
  'label' | 'children'
> | null>(null);

export default function MultipleInputFile({
  label = '',
  children,
  ...props
}: InputFileGroupProps) {
  return (
    <MultipleInputFileContext.Provider value={props}>
      <div className="inputs-files-fields">
        <Typography variant="subtitle1" gutterBottom>
          {label}
        </Typography>
        {children}
      </div>
    </MultipleInputFileContext.Provider>
  );
}

interface InputFileGroupProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'name' | 'label'> {
  label?: string | null;
  children: React.ReactNode;
}
