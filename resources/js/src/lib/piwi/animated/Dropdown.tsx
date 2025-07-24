import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { SvgIconProps } from '@mui/material';
import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';

export default function Dropdown({ on, ...rest }: DropdownProps) {
  const { r } = useSpring({
    r: on ? 180 : 0,
  });

  return (
    <AnimatedArrowDropDownIcon
      {...rest}
      style={{ transform: r.to((piwi) => `rotate(${piwi}deg)`) }}
    />
  );
}

const ArrowDropDownIconForwardedRef = React.forwardRef<
  SVGSVGElement,
  SvgIconProps
>((props, ref) => <ArrowDropDownIcon ref={ref} />);

const AnimatedArrowDropDownIcon = animated(ArrowDropDownIconForwardedRef);

export interface DropdownProps extends SvgIconProps {
  on: boolean;
}
