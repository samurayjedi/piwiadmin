import styled from '@emotion/styled';
import { Slide } from '@mui/material';
import FiltersForm from './FiltersForm';

export default function SlideableFilters({ open }: SlideableFiltersProps) {
  return (
    <Slide
      in={open}
      mountOnEnter
      unmountOnExit
      direction={open ? 'right' : 'left'}
      timeout={300}
    >
      <Container>
        <FiltersForm />
      </Container>
    </Slide>
  );
}

interface SlideableFiltersProps {
  open: boolean;
}

const Container = styled.div({
  display: 'flex',
});
