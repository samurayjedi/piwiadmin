import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSpring, animated, config } from '@react-spring/web';

export default function TrailBorder({ anchorId }: { anchorId: string }) {
  const [xw, setXW] = useState<number[] | null>(null);

  useEffect(() => {
    const el = document.getElementById(anchorId);

    if (el) {
      setXW([el.getBoundingClientRect().x, el.offsetWidth]);
    }
  }, [anchorId]);

  if (xw) {
    const [x, w] = xw;

    return <AnimatedTrailBorder x={x} w={w} />;
  }

  return null;
}

function AnimatedTrailBorder({ x, w }: { x: number; w: number }) {
  const theme = useTheme();
  const spring = useSpring({
    x,
    w,
    config: config.stiff,
  });

  return (
    <animated.div
      style={{
        position: 'absolute',
        bottom: -2,
        left: 0,
        height: 2,
        width: spring.w.to((width) => `${width}px`),
        backgroundColor: theme.palette.secondary.main,
        transform: spring.x.to((offsetX) => `translateX(${offsetX}px)`),
      }}
    />
  );
}
