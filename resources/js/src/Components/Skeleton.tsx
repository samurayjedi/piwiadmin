import {
  Skeleton as MUISkeleton,
  SkeletonProps as MUISkeletonProps,
} from '@mui/material';
import { useAppSelector } from '@/store/hooks';

export default function Skeleton({ children, ...props }: SkeletonProps) {
  const sync = useAppSelector((state) => state.app.sync);

  if (sync === 'ok') {
    return children;
  }

  return <MUISkeleton {...props}>{children}</MUISkeleton>;
}

export interface SkeletonProps extends MUISkeletonProps {}
