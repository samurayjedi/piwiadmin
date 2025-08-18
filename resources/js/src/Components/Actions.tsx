import { useTranslation } from 'react-i18next';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDropdownContext } from '@/src/lib/piwi/core/IconButtonDropdown';

export default function Actions({ onEdit, onDelete }: ActionsProps) {
  const { t } = useTranslation();
  const closeDropdown = useDropdownContext();

  return (
    <List>
      <ListItemButton
        onClick={() => {
          onEdit();
          closeDropdown();
        }}
      >
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary={t('Edit')} />
      </ListItemButton>
      <ListItemButton
        onClick={() => {
          onDelete();
          closeDropdown();
        }}
      >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary={t('Delete')} />
      </ListItemButton>
    </List>
  );
}

interface ActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}
