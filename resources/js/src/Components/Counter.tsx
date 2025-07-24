import React, { useMemo } from 'react';
import { uniqueId } from 'lodash';
import { css } from '@emotion/react';
import { Box, SvgIconProps } from '@mui/material';
import { fa0 } from '@fortawesome/free-solid-svg-icons/fa0';
import { fa1 } from '@fortawesome/free-solid-svg-icons/fa1';
import { fa2 } from '@fortawesome/free-solid-svg-icons/fa2';
import { fa3 } from '@fortawesome/free-solid-svg-icons/fa3';
import { fa4 } from '@fortawesome/free-solid-svg-icons/fa4';
import { fa5 } from '@fortawesome/free-solid-svg-icons/fa5';
import { fa6 } from '@fortawesome/free-solid-svg-icons/fa6';
import { fa7 } from '@fortawesome/free-solid-svg-icons/fa7';
import { fa8 } from '@fortawesome/free-solid-svg-icons/fa8';
import { fa9 } from '@fortawesome/free-solid-svg-icons/fa9';
import FontAwesomeSvgIcon from '@/src/lib/piwi/core/FontAwesomeSvgIcon';

const icons = [fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9];

export type CounterProps = SvgIconProps & {
  number: number;
};

const Counter = React.forwardRef<HTMLElement, CounterProps>(
  ({ number, sx, ...props }: CounterProps, ref) => {
    const id = useMemo(() => uniqueId('counter-'), []);
    const numberParts = number.toString().split('');
    const numberPartsInts = numberParts.map((n) => parseInt(n, 10));

    return (
      <Box sx={sx} ref={ref} css={stylesheet.container}>
        {numberPartsInts.map((n, index) => (
          <FontAwesomeSvgIcon
            sx={{
              marginRight:
                numberParts.length > 1 && index !== numberParts.length - 1
                  ? -1
                  : 0,
            }}
            // eslint-disable-next-line react/no-array-index-key
            key={`${id}-${n}-${index}`}
            icon={icons[n]}
            {...props}
          />
        ))}
      </Box>
    );
  },
);

export default Counter;

const stylesheet = {
  container: css({
    display: 'flex',
    flexDirection: 'row',
    width: 'fit-content',
    alignItems: 'center',
    justifyContent: 'center',
  }),
};
