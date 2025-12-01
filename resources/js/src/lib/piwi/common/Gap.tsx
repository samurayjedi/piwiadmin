import styled from '@emotion/styled';

export default styled.div<GapProps>(({ theme, spacing = 1 }) => ({
  padding: theme.spacing(spacing),
}));

export interface GapProps {
  spacing?: number;
}
