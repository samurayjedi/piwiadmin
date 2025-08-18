/* eslint-disable no-else-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useRef } from 'react';

export default React.forwardRef<HTMLFormElement, HtmlFormProps>(
  ({ onKeyDown, ...props }, ref) => {
    const internalRef = useRef<HTMLFormElement>(null);
    const formRef = ref || internalRef;

    return (
      <form
        {...props}
        ref={formRef}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const skipBehavior = (e.target as HTMLElement).getAttribute(
              'data-htmlform-skip-this',
            );
            if (skipBehavior === 'true') {
              return;
            } else if (
              (e.target as HTMLElement).getAttribute('type') !== 'submit'
            ) {
              e.preventDefault();
            } else {
              return;
            }

            const form =
              formRef && 'current' in formRef ? formRef.current : null;
            if (!form) return;

            const els = Array.from(
              form.querySelectorAll<HTMLElement>(
                'input, button, select, textarea, [tabindex]:not([tabindex="-1"])',
              ),
            ).filter((el) => !el.hasAttribute('disabled'));

            const el = document.activeElement as HTMLElement;
            const i = els.indexOf(el);

            if (i !== -1 && i < els.length - 1) {
              const nextElement = els[i + 1];
              nextElement.focus();
            }
          }

          if (onKeyDown) {
            onKeyDown(e);
          }
        }}
      />
    );
  },
);

export interface HtmlFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  onKeyDown?: (e: React.KeyboardEvent<HTMLFormElement>) => void;
}
