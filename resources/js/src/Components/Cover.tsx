import { useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

export default function Cover({ initial }: { initial?: string }) {
  const { t } = useTranslation();
  const [image, setImage] = useState(initial);

  return (
    <InputFileRoot
      label={t('Upload Photo')}
      className={clsx({ selected: image && image !== '' })}
      image={image}
    >
      <input
        type="file"
        id="product-cover"
        name="cover"
        accept="image/png, image/gif, image/jpeg"
        onChange={(ev) => {
          const { files } = ev.target;
          if (files) {
            const file = files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImage(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }
        }}
      />
    </InputFileRoot>
  );
}

const size = 140;
const InputFileRoot = styled.label<{
  label: string;
  image?: string;
}>(({ theme, label, image = '' }) => ({
  width: size,
  height: size,
  borderWidth: 2,
  color: theme.palette.grey[500],
  borderColor: theme.palette.divider,
  borderStyle: 'dotted',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'border-color .2s ease-in, color .2s ease-in',
  '& input[type="file"]': {
    display: 'none',
  },
  ':hover': {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
  },
  ':before': {
    display: 'block',
    content: '"📎"',
    fontSize: 50,
  },
  ':after': {
    display: 'block',
    content: `"${label}"`,
    fontSize: 16,
    fontWeight: 'bold',
  },
  '&.selected': {
    backgroundImage: `url('${image}')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    '&:before, &:after': {
      display: 'none',
    },
  },
}));
