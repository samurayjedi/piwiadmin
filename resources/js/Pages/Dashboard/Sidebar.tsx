import styled from '@emotion/styled';
import { Paper as MuiPaper } from '@mui/material';

export default function Sidebar() {
  return <Paper>i love shu!!!!</Paper>;
}

const Paper = styled(MuiPaper)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.grey[100],
  borderColor: theme.palette.grey[300],
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 0,
}));
