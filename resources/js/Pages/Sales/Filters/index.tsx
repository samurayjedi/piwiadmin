import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import {
  Dialog,
  DialogContent,
  useMediaQuery,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import SlideableFilters from './SlideableFilters';
import FiltersForm from './FiltersForm';

export default function Filters({ open, onClose }: FiltersProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) {
    return <SlideableFilters open={open} />;
  }

  return (
    <Dialog
      open={open}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      keepMounted
    >
      <DialogContent>
        <Header>
          <Typography variant="h5">{t('Filters')}</Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Header>
        <Box sx={{ p: 1 }} />
        <FiltersForm fullWidth />
      </DialogContent>
    </Dialog>
  );
}

interface FiltersProps {
  open: boolean;
  onClose: () => void;
}

const Header = styled.div({
  display: 'flex',
});
